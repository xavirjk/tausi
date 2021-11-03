var mongoose = require('mongoose')
var {
    hashPassword,
    sendCodeMail
} = require("./misc")
var bcrypt = require('bcryptjs')

const {
    Schema
} = mongoose


// ! Custom required for details regarding phone Number and email
const user = new Schema({
    firstName: {
        type: String,
        required: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    registered: {
        type: Boolean,
        default: false
    },
    registeredOn: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'user',
    timestamps: {
        createdAt: created_at,
        updatedAt: updated_at
    }
})

const {
    method,
    static
} = user;

user.pre('save', async function (next) {
    try {
        var hash = await hashPassword(this.password)
        this.password = hash;
        this.save()

        // todo: Other Validation Steps
        next();
    } catch (error) {
        next(error)
    }

})

method.sendCodeMail = async function (email) {
    try {
        var details = await this.findByEmail(email)
        await sendCodeMail(details)
        return true
    } catch (error) {
        return null
    }
}



static.findByPhoneNumber = async function (number) {
    //  todo: validate input 
    if (!number instanceof Number) {
        return null
    }
    var details = await this.findOne({
        phoneNumber: number
    }).select("firstName lastName email phoneNumber registered");
    return details;
}

static.findByEmail = async function (email) {
    email = email.tolowercase();
    var details = await this.findOne({
        email
    }).select("firstName lastName email phoneNumber registered");
    return details;
}



const userModel = mongoose.model('USERS', user)

module.exports = userModel;