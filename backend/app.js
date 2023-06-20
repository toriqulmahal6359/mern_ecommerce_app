const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

//CORS
app.options('*', cors());
app.use(cors({
  origin: `${process.env.SERVER_URL}`,
}));

//Config
// dotenv.config({path: "backend/config/.env"});
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/.env" });
}

app.use(express.json({limit: "50mb"}));

//Middleware For Authentication
app.use(cookieParser());

//Middleware For Body Parsing
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

//Middleware For Session handling
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

//Middleware for Uploading Files
app.use(fileUpload());

//Middleware For Routes
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
// app.use('/api/v1', cors(), payment);

// Middlewire for File Handling and Storing
// app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, "../frontend/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
// });

//Middleware For errors
const errorMiddleware = require("./middlewares/error");
app.use(errorMiddleware);

module.exports = app;
