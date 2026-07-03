import express from "express";
import cors from "cors";
import expenseRoutes from "./routes/expenseRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Gestion des Dépenses opérationnelle" });
});

app.use("/api/expenses", expenseRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
