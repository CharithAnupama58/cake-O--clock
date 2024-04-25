// const express = require('express');
// const router = express.Router();
// const loginController = require('../Controller/LoginController');
// const { test } = require('../Controller/test');
import express from 'express'
import { login } from '../Controller/Login.js'

// Login route
//router.post('/login', loginController.login);

const router = express.Router();

router.post('/login',login);

export default router

//module.exports = router;
