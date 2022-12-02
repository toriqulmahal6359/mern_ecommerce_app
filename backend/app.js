const express = require('express');
const app = express();

app.use(express.json());

//Middleware For Authentication
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//Middleware For Routes
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);

//Middleware For errors
const errorMiddleware = require("./middlewares/error");
app.use(errorMiddleware);



module.exports = app;
