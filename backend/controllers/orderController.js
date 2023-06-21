const Order = require("../models/Order");
const Product = require("../models/Product");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const SslCommerzPayment = require("sslcommerz-lts");
const order = require("../models/Order");
const { Types } = require('mongoose');

exports.newOrder = catchAsyncErrors(async (req, res, next) => {

    const { shippingInfo, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
    const tran_id = Types.ObjectId().toString();
    
    const data = {
        total_amount: totalPrice,
        currency: 'BDT',
        tran_id: tran_id,
        success_url: `${process.env.SERVER_URL}/api/v1/order/success/${tran_id}`,
        // success_url: `http://${BACKEND_HOST}:${BACKEND_PORT}/success`,
        fail_url: `${process.env.SERVER_URL}/process/payment/fail`,
        cancel_url: `${process.env.SERVER_URL}/process/payment/cancel`,
        ipn_url: `${process.env.SERVER_URL}/process/payment/notification`,
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: shippingInfo.address,
        cus_add2: 'Dhaka',
        cus_city: shippingInfo.city,
        cus_state: shippingInfo.state,
        cus_postcode: shippingInfo.pinCode,
        cus_country: shippingInfo.country,
        cus_phone: shippingInfo.phoneNo,
        cus_fax: '01711111111',
        ship_name: totalPrice + tran_id + Math.random(),
        ship_add1: shippingInfo.address || '',
        ship_add2: 'Dhaka',
        ship_city: shippingInfo.city || '',
        ship_state: shippingInfo.state || '',
        ship_postcode: shippingInfo.pinCode || '',
        ship_country: shippingInfo.country || '',
        multi_card_name: 'mastercard',
        value_a: 'ref001_A',
        value_b: 'ref002_B',
        value_c: 'ref003_C',
        value_d: 'ref004_D'
    }
     
    console.log(data);

  const sslcommer = new SslCommerzPayment(process.env.STORE_ID, process.env.STORE_PASSWORD, false) //true for live default false for sandbox
  sslcommer.init(data).then(async (apiResponse) => {
    //process the response that got from sslcommerz 
    //https://developer.sslcommerz.com/doc/v4/#returned-parameters

    // console.log("data", data);
    let GatewayPageURL = apiResponse.GatewayPageURL;
    console.log(" Redirecting To: ", GatewayPageURL);
    // res.setHeader('Location', apiResponse?.GatewayPageURL);
    // res.status(302).end();
    const order = await Order.create({
        shippingInfo: shippingInfo, 
        orderItems: orderItems,
        paymentInfo: {
            tranId: tran_id,
            status: "NOT PAID"
        }, 
        itemsPrice: itemsPrice, 
        taxPrice: taxPrice, 
        shippingPrice: shippingPrice, 
        totalPrice: totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });
    
    res.send({ url: GatewayPageURL }); 
    
    // return res.send({ url: apiResponse?.GatewayPageURL });
    
    });

});

exports.successOrder = catchAsyncErrors(async (req, res, next) => {
    // console.log(req.params.tran_id);
    const success = await Order.updateOne({ "paymentInfo.tranId" : req.params.tran_id }, {
        $set: { "paymentInfo.status" : "PAID" } 
    })

    // console.log(success.modifiedCount);
    if(success.modifiedCount > 0){
        const successUrl = `${process.env.FRONTEND_PROTOCOL}://${process.env.FRONTEND_URL}/order/success/${req.params.tran_id}`;
        res.redirect(successUrl);
        // res.send({ url : successUrl });
    }
});

// Find Single Order list
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order){
        return next(new ErrorHandler(`Order not found with ${req.params.id} id`, 400));
    }
    res.status(200).json({
        success: true,
        order
    })
});

//Get logged in User Orders
exports.myOrder = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    })
});

//Get All Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.totalPrice
    })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
});

//Update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler('Order not found with this id', 400));
    }
    
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler('You have Already Delivered This Order', 404))
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (order) => {
            await updateStock(order.product, order.quantity);
        });
      }

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }
    
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        messsage: "Order Updated Successfully"
    })
});

// Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler('Order not found with this id', 400));
    }
    await order.remove();

    res.status(200).json({
        success: true,
        message: "Order Deleted Successfully"
    })
});

async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false });
}

