const mongoose=require("mongoose");

const ProductSchema=new mongoose.Schema({
    business_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Businesses"
    },
        
        product_name:{
            type:String,
            required:true
        },
        price:{
            required:true,
            type:String
        },
        discount:{
            type:Number
        },
        max_quantity:{
            type:Number
        },
        product_image:{
            type:Buffer,
            
    
        },
        category:{
            type:String,
            required:true
        }

        }

    )
   

const Products=mongoose.model("Products",ProductSchema)

module.exports=Products