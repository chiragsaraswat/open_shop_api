const express=require("express")
const mongoose=require("mongoose")
const bus_auth=require("../middleware/bus_auth")
const Products =require("../models/products")
const multer=require("multer")
const sharp=require("sharp")

const router=express.Router()
//  router.use(bus_auth)
const upload=multer({
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jiff)$/)){
            return cb(new Error("Please Upload a Image"))

        }
        cb(undefined,true)

    }
})

router.get("/products/all",async (req,res)=>{
    const products=await Products.find({})
    res.send(products);
})

router.get("/search/:product_name",async (req,res)=>{
    const product_name=req.params.product_name
    console.log("in serc r",product_name)
    const products=await Products.find({product_name})
    res.send(products);
})

router.get("/products",bus_auth,async (req,res)=>{
    const products=await Products.find({business_id:req.businesses._id})
    res.send(products);
})
router.post("/products",bus_auth,async(req,res)=>{
    const {product_name,price,discount,category}= req.body
    try{
        const product=new Products({product_name,price,discount,category,business_id:req.businesses._id});
    await product.save()
    res.send(product)
    }catch(e)
    {
        res.status(422).send({error:e.message})
    }
})

router.post("/product/:id/image",bus_auth,upload.single('image'),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:120}).jpeg().toBuffer()
    const products=await Products.findById(req.params.id)
    products.product_image=buffer
    await products.save()
    res.send()
    
    },(error,req,res,next)=>{
    res.status(400).send({error:error.message})

})
router.get("/product/:id/image",async(req,res)=>{
    try{
        const product=await Products.findById(req.params.id)
        if(!product||!product.product_image){
            throw new Error()

        }
        res.set("Content-Type","image/png")
        res.send(product.product_image)

    }catch(e){
        res.status(404).send()

    }

})




module.exports=router

