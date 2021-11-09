const mongoose = require("mongoose")
const { categoryModel } = require('./categories')
const {
    Schema
} = mongoose;


const productSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "categoryModel"
    },
    description: {
        type: String
    },
    discount: {
        type: Number,
        min: 0,
        max: 70,
        default: 10
    },
    price:{
        type:Number,
        min:0
    },
    tags: [{
        tagName: {
            type: String
        }
    }],
    productPic: [{
        location: {
            type: String
        }
    }],
    variety: [{
        quantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number
        },
        color: {
            type: String
        },
        other: {
            type: String,
        }
    }]
}, {
    timestamps: true,
    collection: "PRODCUTS"
})
const {
    methods,
    statics
} = productSchema;

statics.findByName = async function (productName) {
    var details = await productModel.findOne({
        productName
    }).select("-discount -category")
    details.totalPrice = details.price * (details.discount/100);
    return details;
}

statics.findByCategory = async function (categoryName) {
    var categoryId = await categoryModel.findOne({categoryName}).select("id");
    var products = await productModel.findOne({category:categoryId});
    return products;
}

statics.findByPriceRange = async function (low, high) {
    var details = await productModel.find()
    return
}
statics.findByTagName = async function (tagName) {
    const details = await productModel.find({"tags.tagname":tagName});
}

var productModel = mongoose.model("PRODUCTS", productSchema)
module.exports = productModel;