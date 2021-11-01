const mongoose = require("mongoose");

const {
    Schema
} = mongoose;

const shortCodeSchema = Schema({
    email: {
        type: String,
        unique:true
    },
    phoneNumber: {
        type: Number
    },
    code: {
        type: String,
        required: true,
        unique:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30m'
    }
}, {
    collection: "Short_Codes",
    timestamps: true
})

const {methods, statics} = shortCodeSchema;

statics.pre('save',function(){

})

statics.findByEmail = async function(email){
    details = await this.findOne({email})
    return details;
}

statics.findByPhoneNumber = async function(phoneNumber){
    details =  await this.findOne({phoneNumber})
    return details;
}

methods.verifyByEmail = async function(){

}

methods.verifyByPhoneNumber =  async function(){

}

module.exports = mongoose.model('Short_Codes',shortCodeSchema)