import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import raffleRoutes from "./routes/raffleRoutes.js"; // <-- 1. IMPORTAR

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://tu-frontend.vercel.app"
    ],
    credentials: true
}));

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/raffles", raffleRoutes);

// Puerto
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Gateway corriendo en puerto ${PORT}`));