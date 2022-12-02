const Order = require("../models/Order");
const Product = require("../models/Product");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const order = require("../models/Order");

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo: shippingInfo, 
        orderItems: orderItems, 
        paymentInfo: paymentInfo, 
        itemsPrice: itemsPrice, 
        taxPrice: taxPrice, 
        shippingPrice: shippingPrice, 
        totalPrice: totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(200).json({
        success: true,
        order
    });
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
    const order = await Order.find({ user: req.user._id});

    res.status(200).json({
        success: true,
        order
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

    order.orderItems.forEach(async (order) => {
        await updateStock(order.product, order.quantity);
    });

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

