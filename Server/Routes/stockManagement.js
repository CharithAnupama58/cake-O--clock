import express from 'express';
import { getItemDetails,getItemIds,getItemNameDetails,saveStockDetails,getItemExpiryDates,getStockQty,releaseStock,generateNewItemId,addItem,deleteItem,getExpiredStock } from '../Controller/stockManagementController.js';

const router = express.Router();

router.get('/itemDetails', async (req, res) => {
    await getItemDetails(req, res);
});
router.get('/itemIds', async (req, res) => {
    await getItemIds(req, res);
});

router.get('/itemNameDetails/:selectedOption', async (req, res) => {
    await getItemNameDetails(req, res);
});
// router.get('/itemStockQty/:ItemId/:selectedOption1', async (req, res) => {
    //     await getStockQty(req, res);
    // });
router.get('/itemExpiryDates/:ItemId', async (req, res) => {
    await getItemExpiryDates(req, res);
});
router.get('/itemStockQty/:ItemId/:selectedOption1', async (req, res) => {
    await getStockQty(req, res);
});
router.get('/generateNewItemId', async (req, res) => {
    await generateNewItemId(req, res);
});
router.get('/expiredStock', async (req, res) => {
    await getExpiredStock(req, res);
});

router.post('/addStock', async (req, res) => {
   await saveStockDetails(req, res);
});
router.post('/releaseStock', async (req, res) => {
    await releaseStock(req, res);
});
router.post('/addItem', async (req, res) => {
    await addItem(req, res);
});
router.post('/deleteItem', async (req, res) => {
    await deleteItem(req, res);
});
export default router;
