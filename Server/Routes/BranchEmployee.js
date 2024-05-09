import express from 'express';

const router = express.Router();
import {  getCustomizeOrderDetails,getPictureOrderDetails,updateOrderReleseStatus,updatePicOrderReleseStatus } from '../Controller/BranchEmployeeController.js';

router.get('/CustomizeDetails/:branchId', async (req, res) => {
    await getCustomizeOrderDetails(req, res);
});
router.get('/PictureDetails/:branchId', async (req, res) => {
    await getPictureOrderDetails(req, res);
});
router.post('/updateReleaseStatus', async (req, res) => {
    await updateOrderReleseStatus(req, res);
});
router.post('/updatePictureReleaseStatus', async (req, res) => {
    await updatePicOrderReleseStatus(req, res);
});
export default router;