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

statics.pre('save',function(next){
    // ! change to findone and update for the phone Numbers or save 
    var details = db.findByEmail(this.email)
    if (!details){
        var details = db.findByPhoneNumber(this.phoneNumber)
        if(!details){
            next()
        }
    }
    details.code = this.code
    next()
})

methods.findByEmail = async function(email){
    details = await this.findOne({email})
    return details;
}

statics.findByPhoneNumber = async function(phoneNumber){
    details =  await this.findOne({phoneNumber})
    return details;
}

statics.verifyByEmail = async function(email,code){
    var details = this.findByEmail(email)
    if (details){
        if (details.code === code){
            return true
        }
    }
    return null
}

methods.verifyByPhoneNumber =  async function(phoneNumber,code){
    var details = this.findByPhoneNumber(phoneNumber)
    if (details){
        if (details.code === code){
            return true
        }
    }
}

var db = module.exports = mongoose.model('Short_Codes',shortCodeSchema)