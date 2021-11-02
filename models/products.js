const mongoose = require("mongoose")

const { Schema } = mongoose;


const productSchema = new Schema({
    productName:{
        type:String,
        required:true
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category"
    },
    description:{
        type:String
    },
    discount:{
        type:Number,
        min:0,
        max:70,
        default:10
    },
    productPic:[{
        location:{
            type:String
        }
    }],
    variety:[{
        quantity:{
            type:String,
        },
        price:{
            type:Number
        },
        color:{
            type:String
        }  
    }]
})
const {method,static} = productSchema;

method.findByName = async function(){
    return
}

method.findByCategory = async function(){
    return
}

var productModel = mongoose.model("PRODUCTS",productSchema)
module.exports = productModel;