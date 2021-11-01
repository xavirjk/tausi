var mongoose = require('mongoose')
var {
    hashPassword,sendCodeMail
} = require("./misc")
var bcrypt = require('bcryptjs')

const {
    Schema
} = new mongoose

const user = Schema({
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
    methods,
    statics
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

methods.sendCodeMail = async function (email) {
    try {
        var details = await this.findByEmail(email)
        await sendCodeMail(details)
        return true
    } catch (error) {
        return null
    }
}



statics.findByPhoneNumber = async function (number) {
    //  todo: validate input 
    if (!number instanceof Number) {
        return null
    }
    var details = await this.findOne({
        phoneNumber: number
    })
    return details;
}

statics.findByEmail = async function (email) {
    email = email.tolowercase();
    var details = await this.findOne({
        email
    });
    return details;
}



const userModel = mongoose.model('Users', user)

module.exports = userModel;