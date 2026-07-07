import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "Utilisateur"
    },
    email: {
      type: String,
      required: [true, "L'adresse e-mail est requise"],
      unique: true,
      trim: true,
      lowercase: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: {
      type: String,
      default: null
    },
    verificationTokenExpires: {
      type: Date,
      default: null
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"]
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
