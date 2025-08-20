const products =require('../data/product.json');
const Product=require('../models/productModel');
const dotenv =require('dotenv');
const connectDatabse=require('../config/database');

dotenv.config({path:'backend/config/config.env'});
connectDatabse();

const seedProducts=async ()=>{
        try{
            await Product.deleteMany();
            console.log('Products Deleted');
            await Product.insertMany(products);
            console.log('All products added!');
        }
        catch(error){
            console.log(error.message);
            
        }
   
}

seedProducts();