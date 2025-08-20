const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const ErrorHandler=require('../utils/errorHandler');
const sendToken = require('../utils/jwt');
const crypto = require('crypto');

//register user {{base_url}}/api/v1/register
exports.registerUser = catchAsyncError(async (req,res,next)=>{

    const {name,email,password}=req.body

    let avatar;
    if(req.file){
        avatar = `${process.env.BACKEND_URL}/uploads/users/${req.file.originalname}`
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    sendToken(user,201,res)
})

//login user {{base_url}}/api/v1/login
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    // Finding the user from database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email and password', 401));
    }

    // Validate password correctly
    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid) {                             // if(!await user.isValidPassword(password));
        return next(new ErrorHandler('Invalid email and password', 401));
    }

    sendToken(user, 200, res);
})

//logout user {{base_url}}/api/v1/logout
exports.logOutUser=(req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    .status(200)
    .json({
        success:true,
        message:'LoggedOut!'
    })
}

// user forgot password  {{base_url}}/api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req,res,next)=>{
    const user = await User.findOne({email:req.body.email})

    if(!user){
        return next( new ErrorHandler('User not found with this email !',404))
    }
 
    const resetToken = user.getResetToken();
    await user.save({validateBeforeSave:false})

    // create reset url
    const resetUrl =`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    

    const message=`Your password reset url is as follows \n\n
    ${resetUrl}\n\n if you have not request this email, then ignore it.`
    

    try{

        sendEmail({
            email:user.email,
            subject:"AllinOne password recovery",
            message
        })

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email}`
            
        })

    }catch(error){
        user.resetPasswordToken=undefined;
        user.resetPasswordTokenExpire=undefined;
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(error.message,500))
    }
   
})

// user password reset {{base_url}}/api/v1/password/reset/:token
exports.resetPassword = catchAsyncError(async (req,res,next)=>{
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire:{
            $gt:Date.now()
        }
    })

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or expired'))
    }

    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match')) 
    }

    user.password = req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordTokenExpire=undefined;
    await user.save({validateBeforeSave:false})

    sendToken(user, 200, res);

})

//Get User profile {{base_url}}/api/v1/myprofile
exports.getUserProfile = catchAsyncError(async  (req,res,next)=>{
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success:true,
        user
    })
})

//Change Password {{base_url}}/api/v1/password/change
exports.changePassword =catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.user.id).select('+password')       //password properties visible false so it won;t be abailable when req.body so we want to add        select('+password')  using this

    //check old password
    if(!await user.isValidPassword(req.body.oldPassword)){
        return next(new ErrorHandler('Old password is incorrect'),401)
    }

    //assigning new password
    user.password=req.body.password;
    await user.save();

    res.status(200).json({
        success:true
    })
})

//update Profile ----------   {{base_url}}/api/v1/update
exports.updateProfile =catchAsyncError(async (req, res, next)=>{
    let newUserData = {
        name: req.body.name,
        email:req.body.email
    }

    let avatar;
    if(req.file){
        avatar = `${process.env.BACKEND_URL}/uploads/users/${req.file.originalname}`
        newUserData={...newUserData,avatar}
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success:true,
        user
    })
})

//Admin - Get all users --------{{base_url}}/api/v1/admin/users
exports.getAllUsers= catchAsyncError(async (req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
})

//Admin - Get specific user ------------- {{base_url}}/api/v1/admin/users/:id
exports.getUser= catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })
})

//Admin - Update user Role,name, mail ------- ------------- {{base_url}}/api/v1/admin/users/:id
exports.updateUser= catchAsyncError(async (req,res,next)=>{
    const newUserData = {
        name: req.body.name,
        email:req.body.email,
        role:req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success:true,
        user
    })
})

//Admin - Delete user  ----------- ------------- {{base_url}}/api/v1/admin/users/:id
exports.deleteUser= catchAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
    }

    await user.deleteOne();         //await user.remove(); no longer supports in mongoos -2025.03.13

    res.status(200).json({
        success:true
    })
})

