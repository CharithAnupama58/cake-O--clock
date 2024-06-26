import express from 'express';
import {generateUserID,addUser, getAllUserDetails, deleteUser, generateBranchID, addBranch, generateCakeID, addCake} from '../Controller/AdminBoardController.js'


const router = express.Router();

router.get('/userId', async (req, res) => {
    await generateUserID(req, res);
});
router.get('/branchId', async (req, res) => {
    await generateBranchID(req, res);
});
router.get('/allUserDetails', async (req, res) => {
    await getAllUserDetails(req, res);
});
router.get('/cakeId', async (req, res) => {
    await generateCakeID(req, res);
});
router.post('/addUser', async (req, res) => {
    await addUser(req, res);
});
router.post('/deleteUser', async (req, res) => {
    await deleteUser(req, res);
});
router.post('/addBranch', async (req, res) => {
    await addBranch(req, res);
});
router.post('/addCake', async (req, res) => {
    await addCake(req, res);
});


export default router;