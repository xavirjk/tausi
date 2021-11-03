const mongoose = require("mongoose");
const {
    Schema
} = mongoose;

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "categoryModel"
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    complete: {
        type: Boolean,
        default: false
    }
    // ! If the process is approved
    // coupon:{
    //     type:Schema.Types.ObjectId,
    //     ref:"couponModel"
    // }
}, {
    timestamps: true,
    collection: "ORDERS"
})