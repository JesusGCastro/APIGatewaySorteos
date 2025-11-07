import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:5173", // Desarrollo local
        "https://tu-frontend.vercel.app" // Dominio desplegado
    ],
    credentials: true
}));

// Rutas
app.use("/api/users", userRoutes);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Gateway corriendo en puerto ${PORT}`)); 