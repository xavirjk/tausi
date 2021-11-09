const mongoose = require("mongoose");

const {
    Schema
} = mongoose;


const transactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    orders: [{
        order:{
            type:Schema.Types.ObjectId,
            ref:"orderModel"
        }
        // ! To be discussed later
        // coupons:{
        //     type:Schema.Types.ObjectId,
        //     ref:"couponModel"
        // }
    }],
    mode:{
        type:String,
        enum:["CASH","MPESA"],
        default:["CASH"]
    },
    amount:{
        type:Number
    },
    complete: {
        type: Boolean,
        default: false
    },
    transactionId:{
        type:String
    }
    stage: {
        type: String,
        enum: ['TRANSIT', 'COMPLETE', 'BEGIN']
    }
}, {
    timestamps: true,
    collection: "ORDERS"
});