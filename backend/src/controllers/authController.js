import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/email.js";

const TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000;

const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};

const normalizeEmail = (email) => String(email).trim().toLowerCase();

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });

const hashVerificationToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const createVerificationToken = (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = hashVerificationToken(token);
  user.verificationTokenExpires = new Date(Date.now() + TOKEN_EXPIRATION_MS);
  return token;
};

const getApiBaseUrl = (req) => {
  if (process.env.API_URL) return process.env.API_URL.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
};

const sendUserVerificationEmail = async (req, user) => {
  const rawToken = createVerificationToken(user);
  await user.save();

  const verifyLink = `${getApiBaseUrl(req)}/api/auth/verify-email?token=${rawToken}`;
  await sendVerificationEmail(user.email, verifyLink);
};

const toSafeUser = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  emailVerified: user.emailVerified
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email et mot de passe requis");
    }

    if (!isValidEmail(email)) {
      res.status(400);
      throw new Error("Adresse e-mail invalide");
    }

    const normalizedEmail = normalizeEmail(email);
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      res.status(400);
      throw new Error("Utilisateur deja existant");
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: normalizedEmail, password: hashed });

    try {
      await sendUserVerificationEmail(req, user);
    } catch (error) {
      console.warn("Failed to send verification email:", error.message || error);
    }

    const token = signToken(user._id);

    res.status(201).json({
      success: true,
      message: "Compte cree. Verifiez votre e-mail pour confirmer votre adresse.",
      data: { token, user: toSafeUser(user) }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email et mot de passe requis");
    }

    const user = await User.findOne({ email: normalizeEmail(email) });
    if (!user) {
      res.status(401);
      throw new Error("Identifiants invalides");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401);
      throw new Error("Identifiants invalides");
    }

    const token = signToken(user._id);

    res.json({ success: true, data: { token, user: toSafeUser(user) } });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, password, email } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("Utilisateur introuvable");
    }

    let emailChanged = false;
    if (email) {
      if (!isValidEmail(email)) {
        res.status(400);
        throw new Error("Adresse e-mail invalide");
      }

      const normalizedEmail = normalizeEmail(email);
      if (normalizedEmail !== user.email) {
        const exists = await User.findOne({ email: normalizedEmail });
        if (exists) {
          res.status(400);
          throw new Error("Cette adresse e-mail est deja utilisee");
        }
        user.email = normalizedEmail;
        user.emailVerified = false;
        emailChanged = true;
      }
    }

    if (name) user.name = name;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (emailChanged) {
      try {
        await sendUserVerificationEmail(req, user);
      } catch (error) {
        console.warn("Failed to send verification email:", error.message || error);
      }
    } else {
      await user.save();
    }

    const safeUser = await User.findById(req.user.id).select("-password");
    res.json({
      success: true,
      message: emailChanged
        ? "Profil mis a jour. Verifiez votre nouvelle adresse e-mail."
        : "Profil mis a jour",
      data: safeUser
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      res.status(400);
      throw new Error("Token manquant");
    }

    const hashedToken = hashVerificationToken(token);
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      res.status(400);
      throw new Error("Token invalide ou expire");
    }

    user.emailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.json({ success: true, message: "Adresse e-mail verifiee" });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404);
      throw new Error("Utilisateur introuvable");
    }

    if (user.emailVerified) {
      res.status(400);
      throw new Error("Adresse e-mail deja verifiee");
    }

    await sendUserVerificationEmail(req, user);

    res.json({ success: true, message: "E-mail de verification envoye" });
  } catch (error) {
    next(error);
  }
};
