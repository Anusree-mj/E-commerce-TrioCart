const mongoose=require('mongoose')

mongoose.connect("mongodb://localhost:27017/TrioCart")
.then(()=>{
    console.log("mongodb connected")
}).catch(()=>{
    console.log('failed to connect')
})
const ProductSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subCategory:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    size:{
        type:Array,
        required:true
    },
    image:{
        type:String,
        required:true
    },
})
const productsCollection= new mongoose.model("products",ProductSchema)
module.exports={productsCollection}