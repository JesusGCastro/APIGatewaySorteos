import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Rutas de usuario
app.use("", userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("API Gateway running on port " + PORT));    