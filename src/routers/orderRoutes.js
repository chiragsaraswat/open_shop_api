const express=require("express")
const mongoose=require("mongoose")
const auth=require("../middleware/auth")
const Orders=require("../models/orders")



const router=express.Router()
 router.use(auth)


router.get("/orders",async (req,res)=>{
    console.log(req.user._id)
    const orders=await Orders.find({userId:req.user._id})
    
    res.send(orders);
})
router.get("/orders/all",async (req,res)=>{
    console.log(req.user._id)
    const orders=await Orders.find({})
    
    res.send(orders);
})

router.post("/orders",async(req,res)=>{
    const {order,totalprice}= req.body;
    console.log("totla price is",totalprice)
    console.log("order is a",order)
    console.log("user id",req.user._id)

    try{
        const orders=new Orders({products:order,total_price:totalprice,userId:req.user._id});
    await orders.save()
    res.send(orders)

    }catch(e)
    {
        res.status(422).send({error:e.message})
    }

})
module.exports=router

