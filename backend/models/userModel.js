const mongoose = require('mongoose');
const validator = require('validator');
//const LRUCache  = require('lru-cache');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto =require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,'Please enter name']
    },
    email:{
        type: String,
        required:[true,'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']   //validate valid email or not(isEmail)
    },
    password:{
        type:String,
        required:[true,'Please enter password'],
        maxlength:[6,'password cannot exceed 6 characters'],
        select: false       //to hide password when user push a request only when show if user add select(+password)
    },
    avatar:{
        type:String,
    },
    role:{
        type:String,
        default:'user'
    },

    resetPasswordToken:String,

    resetPasswordTokenExpire:Date,
    
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

userSchema.pre('save',async function (next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//create user token using npm jwtToken
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}

//bcrypt and compare entered password and dbstored password using bcrypt.compare and return true or false
userSchema.methods.isValidPassword=async function(enteredPassword){
    return bcrypt.compare(enteredPassword,this.password)
}

userSchema.methods.getResetToken =function(){
    // generate token
    const token= crypto.randomBytes(20).toString('hex');
    //generate hash and set resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    //set token expire time
    this.resetPasswordTokenExpire=Date.now()+(30*60*100);

    return token

}

let User = mongoose.model('User',userSchema);

module.exports = User;