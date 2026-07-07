import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401);
      throw new Error("Non autorisé, token manquant");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("Utilisateur introuvable");
    }

    req.user = { id: user._id, email: user.email, name: user.name };
    next();
  } catch (error) {
    next(error);
  }
};
