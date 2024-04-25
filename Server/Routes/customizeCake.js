import express from 'express';
import {getCakeTypes,getIcingFlavour,getCakeDetails,getBranchIds,placeCustomizeOrder} from '../Controller/customizeCakeController.js'


const router = express.Router();

router.get('/cakeTypes', async (req, res) => {
    await getCakeTypes(req, res);
});

router.get('/icingFlavour', async (req, res) => {
    await getIcingFlavour(req, res);
});

router.get('/cakeDetails/:selectedOption/:selectedOption1', async (req, res) => {
    await getCakeDetails(req, res);
});
router.get('/branchIds', async (req, res) => {
    await getBranchIds(req, res);
});
router.post('/placeCustomizeOrder', async (req, res) => {
    await placeCustomizeOrder(req, res);
});

export default router;