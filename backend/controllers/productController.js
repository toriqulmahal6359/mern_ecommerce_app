const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeature = require("../utils/ApiFeature");
const ErrorHandler = require("../utils/ErrorHandler");
const Product = require("../models/Product");

//User Section

exports.getAllProducts = catchAsyncErrors(
    async(req, res) => {
        const resultPerpage = 20;
        const productCount = await Product.countDocuments();
        const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(4);
        const featuredProducts = await Product.find().sort({ ratings: -1 }).limit(8);
        const apiFeature = new ApiFeature(Product.find(), req.query).search().filter();

        const products = await apiFeature.query;
        let filteredProductsCount = products.length;
        apiFeature.pagination(resultPerpage);

        return res.status(200).json({
            success: true,
            products,
            productCount,
            resultPerpage,
            filteredProductsCount,
            recentProducts,
            featuredProducts
        });
    }
) 

exports.createProduct = catchAsyncErrors(
    async(req, res, next) => {
        let images = [];

        if (typeof req.body.images === "string") {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }
        
        const imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });
      
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }

        req.body.images = imagesLinks;
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

        // Images Start Here
        let images = [];

        if (typeof req.body.images === "string") {
            images.push(req.body.images);
        } else {
            images = req.body.images;
        }
        
        if (images !== undefined) {
            // Deleting Images From Cloudinary
            for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
            }

            const imagesLinks = [];

            for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
            }

            req.body.images = imagesLinks;
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
        
        // Deleting Images From Cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        await product.remove();
        res.status(200).json({
            success: true,
            message: "Product has been deleted Successfully"
        })
    }
) 

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });

  
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
            rating: Number(rating),
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

        let ratings = 0;

        if (reviews.length === 0) {
          ratings = 0;
        } else {
          ratings = avg / reviews.length;
        }

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
