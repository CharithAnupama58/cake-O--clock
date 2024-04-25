import express from 'express';
import {placePictureUploadingOrder} from '../Controller/pictureUploadingOrderController.js'


const router = express.Router();

router.post('/placePictureUploadingOrder', async (req, res) => {
    await placePictureUploadingOrder(req, res);
});

export default router;