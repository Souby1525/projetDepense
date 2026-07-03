import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI est manquant dans le fichier .env");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erreur MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
