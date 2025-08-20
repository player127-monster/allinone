const Product= require('../models/productModel');
const ErrorHandler=require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');

// Get Products ----- /api/v1/products
exports.getProducts = async (req, res, next) => {
    // 👇 Set different resPerPage depending on whether it's a search or not
    const isSearch = req.query.keyword ? true : false;
    const resPerPage = isSearch ? 3 : 4;

    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter();

    const filteredProductsCount = await apiFeatures.query.clone().countDocuments();
    const totalProductsCount = await Product.countDocuments();

    const products = await apiFeatures.paginate(resPerPage).query;

    await new Promise(resolve => setTimeout(resolve, 500));

    res.status(200).json({
        success: true,
        count: filteredProductsCount,
        resPerPage, // include it in the response if frontend needs it
        products
    });
};






//Create Product - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next)=>{
    let images = []
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }
    
    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }

    req.body.images = images;

    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
});

//Get single products ----  {{base_url}}/api/v1/products/:id
exports.getSingleProduct =catchAsyncError(async(req,res,next)=>{
    const product= await Product.findById(req.params.id).populate('reviews.user','name email');
    console.log(product);
    console.log(req.params.id)

    if(!product){
        return next(new ErrorHandler("Product not found !",400));
    }

    res.status(200).json({
        success:true,
        product
    })
})


//Update Product - api/v1/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    //uploading images
    let images = []

    //if images not cleared we keep existing images
    if(req.body.imagesCleared === 'false' ) {
        images = product.images;
    }
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production"){
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }


    req.body.images = images;
    
    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })

})


//delete products ----  {{base_url}}/api/v1/products/:id
exports.deleteProduct = catchAsyncError(async(req,res,next)=>{
    const product= await Product.findById(req.params.id);

    try{
        if(!product){
            res.status(404).json({
                success:false,
                message: "Product Not Found !"
            });
        }
    
        await product.deleteOne();
    
        res.status(200).json({
            success:true,
            message: "Product Deleted !"
        });
    }
    catch (error) {
        console.log(error);
        
    res.status(500).json({
        success: false,
        message: "Server Error: Unable to delete product."
    });
}
})


//creating review api ---------  api/v1/review
exports.createReview = catchAsyncError(async(req,res,next)=>{
    const {productId, rating, comment}= req.body;

    const review = {
        user: req.user.id,
        rating,
        comment
    }

     const product =await Product.findById(productId);

            //verify is user already reviewed the product //finding user review exist
    const isReviewed = product.reviews.find(review =>{
        return review.user.toString() == req.user.id.toString()
    })

   
    //updating the review
    if(isReviewed){
        product.reviews.forEach(review => {
            if(review.user.toString() == req.user.id.toString()){
                review.comment = comment
                review.rating = rating
            }
        });
    }else{
        //creating the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;

    }

    //rating --- finding average rating

    product.ratings = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;


    product.ratings = isNaN(product.ratings)?0:product.ratings;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success: true,
    });

})


//get Reviews ------ api/v1/reviews?id={productId}
exports.getReviews = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.query.id).populate('reviews.user','name email');

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// delete Review -------  api/v1/review?id=_&productId=_
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    // Filtering out the review to be deleted
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    // Updating numOfReviews
    const numOfReviews = reviews.length;

    // Calculating the new average rating
    const ratings = numOfReviews > 0 
        ? reviews.reduce((acc, review) => acc + review.rating, 0) / numOfReviews
        : 0;

    // Updating the product
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    }, { new: true });

    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });
});


// get admin products -- api/v1/admin/products
exports.getAdminProducts= catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).send({
        success:true,
        products
    })
});