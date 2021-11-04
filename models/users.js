var mongoose = require('mongoose')
var {
    hashPassword,
    sendCodeMail,
    comparePassword
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
    },
    loginTracker: [{
        location: {
            type: String //API to check the location of an IP Address
        },
        ipAddress: {
            type: String
        },
        time: {
            type: Date,
            default: Date.now
        },
        access: {
            type: String,
            // remenber to add the different modes using enum
        }
    }]
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
        var user = await userModel.findOne({
            $or: [{
                email: this.email
            }, {
                phoneNumber: this.phoneNumber
            }]
        })
        if (user.length() != 0) {
            next("The user already exists")
        }
        var hash = await hashPassword(this.password)
        this.password = hash;

        next();
    } catch (error) {
        next(error)
    }

})
user.pre('updateOne',async function(next){
    try{
        next();
    }catch(error){
        next(error)
    }
    
})

methods.sendCodeMail = async function () {
    try {
        var details = await userModel.findByEmail(this.email)
        await sendCodeMail(details)
        return true
    } catch (error) {
        return null
    }
}

statics.authenticate = async function (identifier, password) {
    try {
        var details = this.findOne({
            $or: [{
                email: identifier
            }, {
                phoneNumber: identifier
            }]
        }).select("password")
        if (details.length() == 0) {
            return false
        }
        var result = await comparePassword(password, details.password)
        if (result) {
            return true
        }
        return false
    } catch (error) {
        return false
    }

}

statics.findByPhoneNumber = async function (number) {
    //  todo: validate input 
    if (!number instanceof Number) {
        return null
    }
    var details = await this.findOne({
        phoneNumber: number
    }).select("firstName lastName email phoneNumber registered");
    return details;
}

statics.findByEmail = async function (email) {
    email = email.tolowercase();
    var details = await this.findOne({
        email
    }).select("firstName lastName email phoneNumber registered");
    return details;
}



const userModel = mongoose.model('USERS', user)

module.exports = userModel;