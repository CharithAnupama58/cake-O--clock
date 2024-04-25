// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const multer = require('multer');
// const router = require('./Routes/Login');
// const upload = multer();
// const app = express();
// app.use(cors());
// const port = 3001;

import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'
import testRoutes from './Routes/Login.js'
import feedbackRoutes from './Routes/feedback.js'
import stockManagementRoutes from './Routes/stockManagement.js'
import customizeCake from './Routes/customizeCake.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cors());

app.use(express.json());

export const db =  mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'cakeoclock'
});

app.use('/server/test', testRoutes);
app.use('/server/feedback',feedbackRoutes);
app.use('/server/stockManagement',stockManagementRoutes);
app.use('/server/customizeCake',customizeCake)


app.listen(3001, () => {
    console.log('server working');
})

// app.use({'/Server/test',router})


// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log('Connected to MySQL database');
// });


// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
// app.get('/users', (req, res) => {
//     // Define the SQL query to retrieve data from the user table
//     const sql = 'SELECT * FROM user';

//     // Execute the query
//     db.query(sql, (err, results) => {
//         if (err) {
//             // If there's an error, send a 500 Internal Server Error response
//             console.error('Error retrieving user data:', err);
//             res.status(500).json({ error: 'Internal Server Error' });
//         } else {
//             // If the query is successful, send the results as a JSON response
//             res.json(results);
//         }
//     });
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Uploads will be stored in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original file name
  }
});

const upload = multer({ storage: storage });

// Handle POST request to upload image
app.post('/uploads', upload.single('image'), async (req, res) => {
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log('Uploaded file:', req.file);
    console.log('Image URL:', imageUrl);
    res.json({ imageUrl });

});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

