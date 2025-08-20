const express=require('express');
const multer = require('multer');
const path = require('path');

const upload = multer({storage:multer.diskStorage({
    destination:function(req, file, cb ){
        cb(null, path.join(__dirname,'..','uploads/users'))
    },
    filename:function(req,file,cb){
        cb(null, file.originalname)
    }
})})

const { 
    registerUser,
    loginUser, 
    logOutUser, 
    forgotPassword, 
    resetPassword, 
    getUserProfile,
    changePassword,
    updateProfile,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
     } = require('../controllers/authController');
const router = express.Router();
const {isAuthenticatedUser, authorizedRoles} = require('../middlewares/authenticate');

//register user {{base_url}}/api/v1/register
router.route('/register').post(upload.single('avatar'),registerUser);

//login user {{base_url}}/api/v1/login
router.route('/login').post(loginUser);

//logout user {{base_url}}/api/v1/logout
router.route('/logout').get(logOutUser);

// user forgot password  {{base_url}}/api/v1/password/forgot
router.route('/password/forgot').post(forgotPassword);

// user password reset {{base_url}}/api/v1/password/reset/:token
router.route('/password/reset/:token').post(resetPassword);

// user profile {{base_url}}/api/v1/myprofile
router.route('/myprofile').get(isAuthenticatedUser,getUserProfile);

// change password  {{base_url}}/api/v1/password/change
router.route('/password/change').put(isAuthenticatedUser, changePassword);

// Update profile {{base_url}}/api/v1/update
router.route('/update').put(isAuthenticatedUser,upload.single('avatar'), updateProfile);


// ====================Admin routes===========================

// Admin- get all user profiles {{base_url}}/api/v1/admin/users
router.route('/admin/users').get(isAuthenticatedUser, authorizedRoles('admin'),getAllUsers);

// Admin- get single user profile {{base_url}}/api/v1/admin/users/:id
router.route('/admin/user/:id').get(isAuthenticatedUser, authorizedRoles('admin'),getUser);

// Admin- update single user profile {{base_url}}/api/v1/admin/users/:id
router.route('/admin/user/:id').put(isAuthenticatedUser, authorizedRoles('admin'),updateUser);

// Admin- delete single user  {{base_url}}/api/v1/admin/users/:id
router.route('/admin/user/:id').delete(isAuthenticatedUser, authorizedRoles('admin'),deleteUser);

module.exports =router;