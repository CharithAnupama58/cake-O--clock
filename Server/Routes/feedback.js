import express from 'express'
import { feedback } from '../Controller/feedbackController.js'

// Login route
//router.post('/login', loginController.login);

const router = express.Router();

router.post('/feedback',feedback);

export default router