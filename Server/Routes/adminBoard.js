import express from 'express';
import {generateUserID,addUser} from '../Controller/AdminBoardController.js'


const router = express.Router();

router.get('/userId', async (req, res) => {
    await generateUserID(req, res);
});
router.post('/addUser', async (req, res) => {
    await addUser(req, res);
});


export default router;