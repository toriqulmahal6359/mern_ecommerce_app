const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeature = require("../utils/apiFeature");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../models/Product");

//Admin Section

exports.getAllProducts = catchAsyncErrors(
    async(req, res) => {
        const resultPerpage = 3;
        const productCount = await Product.countDocuments();

        const apiFeature = new ApiFeature(Product.find(), req.query).search().filter();

        const products = await apiFeature.query;
        let filteredProductsCount = products.length;
        apiFeature.pagination(resultPerpage);

        return res.status(200).json({
            success: true,
            products,
            productCount,
            resultPerpage,
            filteredProductsCount
        });
    }
) 

exports.createProduct = catchAsyncErrors(
    async(req, res, next) => {
        req.body.user = req.user.id;
        const product = await Product.create(req.body);
        res.status(200).json({
            success: true,
            product
        });
    }
) 

exports.updateProduct = catchAsyncErrors(
    async(req, res, next) => {
        let product = await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("Product Not Found", 404));
        }
    
        product = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, {
            new: true, runValidators: true, useFindandModify: false
        });
    
        res.status(200).json({
            success: true,
            product 
        });
    }
) 

exports.deleteProduct = catchAsyncErrors(
    async(req, res, next) => {
        const product = await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("Product Not Found", 404));
        }
    
        await product.remove();
        res.status(200).json({
            success: true,
            message: "Product has been deleted Successfully"
        })
    }
) 

exports.getProductDetails = catchAsyncErrors(
    async(req, res, next) => {
        const product = await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("Product Not Found", 404));
        }
    
        res.status(200).json({
            success: true,
            product
        })
    }
) 

exports.createProductReview = catchAsyncErrors(
    async(req, res, next) => {
        const {rating, comment, productId} = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: req.body.rating,
            comment
        };

        const product = await Product.findById(productId);
        const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id.toString());

        if(isReviewed){
            product.reviews.forEach(rev => {
                if(rev.user.toString() === req.user._id.toString())
                    rev.rating = rating,
                    rev.comment = comment
            });
        }else{
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        let avg = 0;
        product.ratings = product.reviews.forEach(rev => {
            avg += rev.rating
        }) 

        product.ratings = avg/product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
        });

    }
)

exports.getProductReviews = catchAsyncErrors(
    async (req, res, next) => {
        const product = await Product.findById(req.query.id);

        if(!product){
            return next(new ErrorHandler("Product Not Found", 404));
        }

        res.status(200).json({
            success: true,
            reviews: product.reviews
        });
    }
)

exports.deleteReviews = catchAsyncErrors(
    async (req, res, next) => {
        const product = await Product.findById(req.query.productId);

        if(!product){
            return next(new ErrorHandler("Product Not Found", 404));
        }

        const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());

        let avg = 0;
        reviews.forEach(rev => {
            avg += rev.rating
        });

        const ratings = avg/reviews.length;
        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(req.query.productId, {
            reviews:reviews, 
            ratings:ratings, 
            numOfReviews:numOfReviews 
        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        res.status(200).json({
            success: true,
            message: "Review Deleted"
        });
    }
)