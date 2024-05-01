import express from 'express';
import { getOrderDetails } from '../Controller/orderController.js';

const router = express.Router();

router.get('/orderDetails', async (req, res) => {
    await getOrderDetails(req, res);
});


export default router;