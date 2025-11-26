import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const RAFFLE_SERVICE_URL = process.env.RAFFLE_SERVICE_URL;

// Middleware para reenviar peticiones al microservicio de sorteos
const forwardRequest = async (req, res) => {
    try {
        const { method, originalUrl, body, headers } = req;
        
        const serviceUrl = `${RAFFLE_SERVICE_URL}${originalUrl.replace('/api/raffles', '')}`;

        const response = await axios({
            method,
            url: serviceUrl,
            data: body,
            headers: {
                // Solo reenviamos la cabecera de autorización si existe
                ...(headers.authorization && { Authorization: headers.authorization })
            }
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const data = error.response ? error.response.data : { error: "Error interno en el Gateway" };
        res.status(status).json(data);
    }
};

// Rutas para cada peticion
router.put('/admin/state/:raffleId', forwardRequest);
router.put('/admin/update/:raffleId', forwardRequest);
router.get('/admin/ended', forwardRequest);
router.get('/admin/inactive', forwardRequest);

router.get('/tickets/:raffleId/user', forwardRequest);
router.get('/tickets/aparted/:raffleId/user', forwardRequest);


router.get('/my-raffles', forwardRequest);

router.get('/', forwardRequest);
router.post('/', forwardRequest);

router.get('/:raffleId', forwardRequest);
router.post('/:raffleId/tickets', forwardRequest);
router.get('/:raffleId/tickets', forwardRequest);

router.put('/tickets/pay/:raffleId', forwardRequest);
router.put('/tickets/pay/:raffleId/transaction', forwardRequest);

export default router;