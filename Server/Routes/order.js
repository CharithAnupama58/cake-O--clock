import express from 'express';
import { getOrderDetails,getAllOrderDetails,updateOrderStatus,getAllTemporaryOrderDetails,savePicOrders,getAllPictureOrderDetails,deletePicOrders,getPicOrderDetails,updatePicOrderStatus,getTodayCustomOrderDetails,updateOrderReleseStatus,getTodayPictureOrderDetails,updatePicOrderReleseStatus,deleteCustomizeOrders,deletePictureUploadOrders } from '../Controller/orderController.js';

const router = express.Router();

router.get('/orderDetails', async (req, res) => {
    await getOrderDetails(req, res);
});
router.get('/picorderDetails', async (req, res) => {
    await getPicOrderDetails(req, res);
});

router.get('/AllorderDetails', async (req, res) => {
    await getAllOrderDetails(req, res);
});
router.get('/AllPictureorderDetails', async (req, res) => {
    await getAllPictureOrderDetails(req, res);
});
router.get('/AllTemporaryOrderDetails', async (req, res) => {
    await getAllTemporaryOrderDetails(req, res);
});
router.get('/CustomizeorderDetails', async (req, res) => {
    await getTodayCustomOrderDetails(req, res);
});
router.get('/pictureUploadingOrderDetails', async (req, res) => {
    await getTodayPictureOrderDetails(req, res);
});
router.post('/updateStatus', async (req, res) => {
    await updateOrderStatus(req, res);
});
router.post('/updateReleaseStatus', async (req, res) => {
    await updateOrderReleseStatus(req, res);
});
router.post('/updatePicReleaseStatus', async (req, res) => {
    await updatePicOrderReleseStatus(req, res);
});
router.post('/updatePicStatus', async (req, res) => {
    await updatePicOrderStatus(req, res);
});
router.post('/savePictureOrders', async (req, res) => {
    await savePicOrders(req, res);
});
router.post('/deleteTempOrder', async (req, res) => {
    await deletePicOrders(req, res);
});
router.post('/deleteCustomizeOrder', async (req, res) => {
    await deleteCustomizeOrders(req, res);
});
router.post('/deletePictureUploadOrder', async (req, res) => {
    await deletePictureUploadOrders(req, res);
});
export default router;