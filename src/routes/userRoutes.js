import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

//Registrar usuario
router.post("/register", async (req, res) => {
    try {
        const response = await axios.post(`${USER_SERVICE_URL}/register`, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({
            error: "Error en gateway al registrar usuario"
        });
    }
});

//Iniciar sesión de usuario
router.post("/login", async (req, res) => {
    try {
        const response = await axios.post(`${USER_SERVICE_URL}/login`, req.body);
        res.status(response.status).json(response.data);
    } catch (error){
        res.status(error.response ? error.response.status : 500).json({
            error: "Error en gateway al iniciar sesión"
        });
    }
});

//Obtener información del usuario
router.get("/perfil", async (req, res) => {
    try {
        const response = await axios.get(`${USER_SERVICE_URL}/perfil`, {
            headers: {
                Authorization: req.headers.authorization
            }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({
            error: "Error en gateway al obtener perfil de usuario"
        });
    }
});

//Verificar token
router.get("/verify-token", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ valid: false, error: "Token no proporcionado" });
  }

  try {
    const response = await axios.get(`${USER_SERVICE_URL}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      valid: false,
      error: "Error en gateway al verificar token"
    });
  }
});


export default router;