const express = require('express');
const router = express.Router();
const { processPayment } = require("../controllers/paymentController");
const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/process/payment").get((req, res) => {
    res.send("Payment Processing is not supported via GET method");
}).post(processPayment);

module.exports = router;