import express from 'express';
import proxy from 'express-http-proxy';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const RAFFLE_SERVICE_URL = process.env.RAFFLE_SERVICE_URL;

// Configuración de Multer para recibir el archivo en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 1. RUTA ESPECÍFICA PARA CREAR SORTEO (con manejo de imagen)
router.post(
  '/',
  upload.single('urlImagen'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No se proporcionó ninguna imagen." });
      }

      // Sube la imagen a ImgBB
      const formData = new FormData();
      formData.append('image', req.file.buffer.toString('base64'));
      const imgBbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
        formData
      );
      const imageUrl = imgBbResponse.data.data.display_url;

      // Construye el nuevo cuerpo JSON para enviar al microservicio
      const newBody = {
        ...req.body, // Todos los datos de texto del formulario original
        urlImagen: imageUrl, // Reemplaza/añade la URL de ImgBB
      };

      // Reenvía la petición AHORA COMO JSON al ServicioSorteos
      const serviceResponse = await axios.post(
        `${RAFFLE_SERVICE_URL}/`,
        newBody,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(req.headers.authorization && { Authorization: req.headers.authorization })
          }
        }
      );
      
      res.status(serviceResponse.status).json(serviceResponse.data);

    } catch (error) {
      console.error("Error en Gateway al crear sorteo:", error.response ? error.response.data : error.message);
      const status = error.response ? error.response.status : 500;
      res.status(status).json({ error: "Error en el Gateway al procesar la creación del sorteo." });
    }
  }
);


// 2. PROXY GENÉRICO PARA TODAS LAS DEMÁS RUTAS DE SORTEOS
// Este middleware se ejecutará para cualquier ruta que NO sea la de POST / que definimos arriba.
router.use('/', proxy(RAFFLE_SERVICE_URL, {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace('/api/raffles', '');
  }
}));

export default router;