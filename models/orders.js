const mongoose = require("mongoose");

const {
    Schema
} = mongoose;


const orderSchema = new Schema({
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
    },
    stage: {
        type: String,
        enum: ['transit', 'complete', 'begin']
    }
}, {
    timestamps: true,
    collection: "ORDERS"
});

var orderModel = mongoose.model("ORDERS", orderSchema)
module.exports = orderModel;