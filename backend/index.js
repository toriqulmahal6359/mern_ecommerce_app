const express = require('express');
const app = require("./app");
const dotenv = require('dotenv');
const connectDatabase = require("./config/database");
const cloudinary = require('cloudinary');

// Config
// dotenv.config({path: "backend/config/.env"});
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/.env" });
}

//Handling Uncaught Exception
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down due to Uncaught Exception`);
    process.exit(1);
}); 

app.get('/', async(req, res) => {
    return res.status(200).json({
        message: "I'm A Ecommerce Site to be built"
    });
});

//Connecting the Database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

//Unhandled Error Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down due to Unhandled Error Rejection`);

    server.close(()=> {
        process.exit(1);
    });
});

if(process.env.NODE_ENV == 'PRODUCTION'){
    const path = require('path');

    app.get('/', (req, res) => {
      app.use(express.static(path.resolve(__dirname, 'frontend', 'build')))
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}

const PORT = process.env.PORT || 3100;
const hostname = 'mahal.com'; 
const server = app.listen(PORT, () => {
    console.log(`Server is Running from port http://${hostname}:${process.env.PORT}`);
});