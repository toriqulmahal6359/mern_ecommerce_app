const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/User");
const sendToken = require("../utils/jwt_token");
const sendMail = require("../utils/sendMail.js");
const crypto = require("crypto"); 
const cloudinary = require('cloudinary');

exports.userRegister = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale'
    });
    const {name, email, password} = req.body;
    const user = await User.create({
        name, email, password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    sendToken(user, 201, res);
});

exports.userLogin = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body;

    // Checking if User email and password are stored in Database
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email and Password", 401));
    }
    const user = await User.findOne({ email:email }).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 201, res);
});

exports.userLogout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out Successfully"
    })
});

// Forget Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if(!user){
        return next(new ErrorHandler("User Not Found", 404));
    }

    //Get Reset Password Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_PROTOCOL}://${process.env.FRONTEND_URL}/password/reset/${resetToken}`

    const message = `Your Password Reset Token is :-  \n\n${resetPasswordUrl}\n\n. If you have not requested this mail, then please Ignore.`;
    try{
        await sendMail({
            email: user.email,
            subject: 'Ecommerce Password Recovery',
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email is sent to ${user.email} Successfully`
        })
    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }
})

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if(!user){
        return next(new ErrorHandler("Reset Password Token is Invalid or may be expired", 404));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password Not Matched !!!", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
})

//Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

//Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is Incorrect", 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});

//Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    if(req.body.avatar !== ''){

        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale'
        });
        
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidator: true,
        userFindAndModify: false,
    });

    res.status(200).json({
        success: true
    });
});

//Get All User -- Admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
});

//Get Single User -- Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User Does not Exist with this id: ${req.params.id}`, 400));
    }

    res.status(200).json({
        success: true,
        user
    })
});

//Update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidator: true,
        userFindAndModify: false,
    });

    if(!user){
        return next(new ErrorHandler(`User Does not Exist with this id: ${req.params.id}`, 400));
    }

    res.status(200).json({
        success: true
    });
});

//Delete User Profile -- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User Does not Exist with this id: ${req.params.id}`, 400));
    }

    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    
    await user.remove();
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully"
    });
});