// app.js

const express = require('express');
const userRouter = require('./routes/user.routes'); 
const dotenv = require('dotenv');   
dotenv.config();
const connectToDB = require('./config/db')
connectToDB();
const cookieParser = require('cookie-parser');
const app = express();
const indexRouter = require('./routes/index.routes');
const path = require('path');
const multer = require('multer');
const File = require('./models/file.models'); 

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});



// Middleware setup
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/user', userRouter);
app.use('/', indexRouter);


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
