const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        maxLength: [30, "Name should not exceed 30 Characters"],
        minLength: [2, "Name Should have more than Two Characters"]
    },
    email:{
        type: String,
        required: [true, "Please Enter your Email Address"],
        unique: true,
        validate: [validator.isEmail, "please Enter a valid Email Address"]
    },
    password:{
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should have more than 8 Characters"],
        select: false
    },
    avatar:{
        public_id: {
            type: String, 
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});


userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
userSchema.methods.getJWTToken = function (){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

//Compare Password
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function(){
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hashing and adding resetPsswordToken in userSchema
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    //Expire token
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;

}

const user = new mongoose.model("User", userSchema);
module.exports = user;
