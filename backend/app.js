const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const cors = require('cors');

//Config
dotenv.config({path: "backend/config/.env"});

app.use(express.json());

// app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // next();
  // });

//Middleware For Authentication
const cookieParser = require('cookie-parser');
app.use(cookieParser());

//Middleware For Body Parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Middleware for Uploading Files
app.use(fileUpload());

// For avoiding CORS error
// const corsOptions = {
//   origin: "http://localhost:3000"
// };
app.options('*', cors());
app.use(cors());

//Middleware For Routes
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const payment = require("./routes/paymentRoute");
app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);

//Middleware For errors
const errorMiddleware = require("./middlewares/error");
app.use(errorMiddleware);



module.exports = app;
