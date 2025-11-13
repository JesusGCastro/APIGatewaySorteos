// import express from "express";
// import axios from "axios";
// import dotenv from "dotenv";
// dotenv.config();

// const router = express.Router();
// const RAFFLE_SERVICE_URL = process.env.RAFFLE_SERVICE_URL;

// // Middleware para reenviar peticiones al microservicio de sorteos
// const forwardRequest = async (req, res) => {
//     try {
//         const { method, originalUrl, body, headers } = req;
        
//         const serviceUrl = `${RAFFLE_SERVICE_URL}${originalUrl.replace('/api/raffles', '')}`;

//         const response = await axios({
//             method,
//             url: serviceUrl,
//             data: body,
//             headers: {
//                 // Solo reenviamos la cabecera de autorización si existe
//                 ...(headers.authorization && { Authorization: headers.authorization })
//             }
//         });

//         res.status(response.status).json(response.data);
//     } catch (error) {
//         const status = error.response ? error.response.status : 500;
//         const data = error.response ? error.response.data : { error: "Error interno en el Gateway" };
//         res.status(status).json(data);
//     }
// };

// // Rutas para cada peticion
// router.get('/', forwardRequest);
// router.post('/', forwardRequest);
// router.get('/:raffleId', forwardRequest);
// router.post('/:raffleId/tickets', forwardRequest);
// router.get('/:raffleId/tickets', forwardRequest);
// router.put('/admin/state/:raffleId', forwardRequest);
// router.get('/admin/ended', forwardRequest);
// router.get('/admin/inactive', forwardRequest);

// export default router;


///// NUEVA VERSION

import express from 'express';
import proxy from 'express-http-proxy'; // Se importa el nuevo middleware de proxy
import dotenv from 'dotenv';

// Nota: 'axios' y la función 'forwardRequest' ya no son necesarios aquí.

dotenv.config();

const router = express.Router();
const RAFFLE_SERVICE_URL = process.env.RAFFLE_SERVICE_URL;

// --- INICIO DE LA ÚNICA MODIFICACIÓN ---

// Esta única sección de código reemplaza todas las definiciones de rutas individuales.
// router.use('/') le dice a Express: "Aplica este middleware a CUALQUIER petición
// que llegue a la ruta base de este enrutador ('/api/raffles')".
router.use('/', proxy(RAFFLE_SERVICE_URL, {
  
  // proxyReqPathResolver es una función que determina la ruta final
  // que se enviará al microservicio de destino (ServicioSorteos).
  proxyReqPathResolver: (req) => {
    // req.originalUrl es la ruta completa que recibió el Gateway.
    // Ejemplos:
    // 1. Si llega '/api/raffles/admin/state/123',
    // 2. Si llega '/api/raffles/5/tickets',
    // 3. Si llega '/api/raffles/'

    // La función .replace() quita el prefijo '/api/raffles'.
    // Resultados:
    // 1. -> '/admin/state/123'
    // 2. -> '/5/tickets'
    // 3. -> '/'

    // El resultado es exactamente la ruta que el ServicioSorteos espera recibir.
    return req.originalUrl.replace('/api/raffles', '');
  }
}));

// --- FIN DE LA MODIFICACIÓN ---

export default router;