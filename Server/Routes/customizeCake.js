import express from 'express';
import {getCakeTypes,getIcingFlavour,getCakeDetails,getBranchIds,placeCustomizeOrder, getCakePrice, createPaymentIntent} from '../Controller/customizeCakeController.js'


const router = express.Router();

router.get('/cakeTypes', async (req, res) => {
    await getCakeTypes(req, res);
});

router.get('/icingFlavour/:selectedOption2', async (req, res) => {
    await getIcingFlavour(req, res);
});

router.get('/cakeDetails/:selectedOption/:selectedOption1', async (req, res) => {
    await getCakeDetails(req, res);
});
router.get('/branchIds', async (req, res) => {
    await getBranchIds(req, res);
});
router.get('/cakePrice/:cakeId', async (req, res) => {
    await getCakePrice(req, res);
});
router.post('/placeCustomizeOrder', async (req, res) => {
    await placeCustomizeOrder(req, res);
});
router.post('/payments', async (req, res) => {
    await createPaymentIntent(req, res);
});

export default router;