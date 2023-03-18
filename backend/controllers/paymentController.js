const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const SSLCommerz = require("sslcommerz-nodejs");
const Product = require("../models/Product");
const Order = require("../models/Order");
const dotenv = require('dotenv');
dotenv.config({path: "backend/config/.env"});

exports.processPayment = catchAsyncErrors(async(req, res, next) => {
    console.log(req.body);
    let settings = {
        isSandboxMode: true,
        store_id: process.env.STORE_ID,
        store_passwd: process.env.STORE_PASSWORD
    };

    let sslcommerz = new SSLCommerz(settings);
    let valid = "1709162025351ElIuHtUtFReBwE";

    await sslcommerz.validate_transaction_order(valid).then(response => {
        return response;
    }).catch(error => {
        console.log(error);
    })

});
