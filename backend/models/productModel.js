const mongoose = require('mongoose');

const productSchema =new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Please enter product name"],
        trim:true,
        maxlength:[100,"Product name cannot exceed 100 characters"]
    },
    price:{
        type: Number,
       // required:true, // if we use default value no need to this comand .
        default:0.0,

    },
    description:{
        type: String,
        required:[true,"Please enter product description"]
    },
    ratings:{
        type: Number,
        default:0
    },
    images:[
        {
            image:{
                type: String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        required:[true,"Please enter product category"],
        enum:{
            values:[
                'Electronics',
                'Mobile Phones',
                'Smart Watch',
                'Desktop/Laptops',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message:"Please select correct category"
        }
    },
    seller:{
        type: String,
        required:[true,"Please enter product seller"]
    },
    stock:{
        type: Number,
        required:[true,"Please enter product stock"],
        maxlength:[20,"Product stock cannot exceed 20"]
    },
    numOfReviews:{
        type: Number,
        default:0
    },
    reviews:[
        {
            user: {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            },
            rating:{
                type: Number,
                required:true
            },
            comment:{
                type: String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
    
})


let Product = mongoose.model('Product',productSchema)

module.exports = Product