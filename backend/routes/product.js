const express =require('express');
const multer = require('multer');
const path = require('path');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts } = require('../controllers/productController');
const router = express.Router();
const {isAuthenticatedUser, authorizedRoles}=require('../middlewares/authenticate'); // without curly bracket it will get a module if we use curly brace then it will be a function


const upload = multer({storage:multer.diskStorage({
    destination:function(req, file, cb ){
        cb(null, path.join(__dirname,'..','uploads/product'))
    },
    filename:function(req,file,cb){
        cb(null, file.originalname)
    }
})})



router.route('/products').get(getProducts);    //isAuthenticatedUser,


router.route('/product/:id').get(getSingleProduct);


//create review ----------api/v1/review
router.route('/review').put(isAuthenticatedUser,createReview);




//admin routes
// crete product only admin can create product ---------- {{base_url}}/api/v1/admin/products/new
router.route('/admin/products/new').post(isAuthenticatedUser,authorizedRoles('admin'),upload.array('images'), newProduct);

router.route('/admin/products').get(isAuthenticatedUser,authorizedRoles('admin'), getAdminProducts);

router.route('/admin/product/:id').delete(isAuthenticatedUser,authorizedRoles('admin'), deleteProduct);
router.route('/admin/product/:id').put(isAuthenticatedUser,authorizedRoles('admin'),upload.array('images'), updateProduct);

//get Reviews ------ api/v1/reviews?id={productId}
router.route('/admin/reviews').get(isAuthenticatedUser,authorizedRoles('admin'),getReviews);
router.route('/admin/review').delete(isAuthenticatedUser,authorizedRoles('admin'),deleteReview);


module.exports= router