import express from 'express';
import { getOrderDetails,getAllOrderDetails,updateOrderStatus,getAllTemporaryOrderDetails } from '../Controller/orderController.js';

const router = express.Router();

router.get('/orderDetails', async (req, res) => {
    await getOrderDetails(req, res);
});

router.get('/AllorderDetails', async (req, res) => {
    await getAllOrderDetails(req, res);
});
router.get('/AllTemporaryOrderDetails', async (req, res) => {
    await getAllTemporaryOrderDetails(req, res);
});
router.post('/updateStatus', async (req, res) => {
    await updateOrderStatus(req, res);
});


export default router;