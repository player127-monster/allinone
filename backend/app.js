const express= require('express');
const dotenv = require('dotenv');
const path = require('path');
const app=express();    //creating a object for express
const errorMiddleWare= require('../backend/middlewares/error');
const cookieParser= require('cookie-parser');

dotenv.config({path: path.join(__dirname,"config/config.env")});

const products =require('./routes/product')
const auth =require('./routes/auth')
const order=require('./routes/orders')
const payment=require('./routes/payment')

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.use('/api/v1/',products)
app.use('/api/v1/',auth)
app.use('/api/v1/',order)
app.use('/api/v1/',payment)


app.use(errorMiddleWare)
module.exports=app;     // exporting app.js 

