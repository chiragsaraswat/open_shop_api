const mongoose=require("mongoose");
const moment = require('moment-timezone');
const dateIndia = moment.tz(Date.now(), "Asia/Kolkata").format('ha z');

const ordersSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    products:{
        type:Array
    },
    
    total_price:{
        type:Number,
        required:true
    },
    ordered_at:{
        type:String,
        default:dateIndia
    },
    completed:{
        type:Boolean,
        default:false
    }
        
    

},{
    timestamps:true
})
const Orders=mongoose.model("Orders",ordersSchema)
module.exports=Orders 
