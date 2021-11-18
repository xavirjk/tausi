var mongoose = require('mongoose')
var {
    hashPassword,
    sendCodeMail,
    comparePassword
} = require("./misc")

const {
    Schema
} = mongoose


// ! Custom required for details regarding phone Number and email
const user = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: function () {
            if (this.phoneNumber.length == 0) {
                return false
            }
            return true
        },
        lowercase: true
    },
    phoneNumber: {
        type: Number,
        required: function () {
            if (this.phoneNumber) {
                return false
            }
            return true
        }
    },
    registered: {
        status: {
            type: Boolean,
            default: false
        },
        when: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        status: {
            type: Boolean,
            default: false
        },
        when: {
            type: Date,
            default: Date.now
        }
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
        createdAt: "created_at",
        updatedAt: "updated_at"
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
        
        if (user) {
            next("The user already exists")
        }
        if (this.password.length < 8) {
            next("password.length < 8")
        }
        var hash = await hashPassword(this.password)
        /** 
         * setting the required values in case they 
         * are overwritten in the schema sent
         */
        this.password = hash;
        this.registered.status = false;
        this.deleted.status = false;

        next();
    } catch (error) {
        console.log(RangeError)
        next(error)
    }

})
user.pre('updateOne', async function (next) {
    try {
        //check if there is a password to prevent it from being updated

        if (this.password) {
            next("Cannot update password")
        }
        // ! why is this necessary
        var user = await userModel.findOne({
            $or: [{
                email: this.email
            }, {
                phoneNumber: this.phoneNumber
            }]
        })
        if (user.length() != 0) {
            next("Cannot update email or password")
        }
        next();
    } catch (error) {
        next(error)
    }
})

statics.updatePassword = async function (email, password) {
    var hash = await hashPassword(password)
    const user = userModel.findOneAndUpdate({
        email
    }, {
        $set: {
            password: hash
        }
    })
    if (!user) {
        return False
    }
    return true
}

statics.deleteUser = async function (identifier) {
    let user = await userModel.findOneAndUpdate({
        $or: [{
            email: identifier
        }, {
            phoneNumber: identifier
        }]
    }, {
        $set: {
            "delete.declared": true,
            "delete.when": Date.now()
        }
    })
    if (user) {
        return true
    }
    return false
}

methods.sendCodeMail = async function () {
    try {
        var details = await userModel.findByEmail(this.email)
        await sendCodeMail(details)
        return true
    } catch (error) {
        return null
    }
}

statics.authenticate = async function (identifier, password, host) {
    try {
        var details = this.findOne({
            $or: [{
                email: identifier
            }, {
                phoneNumber: identifier
            }]
        }).select("password")
        if (!details) {
            return false
        }
        var result = await comparePassword(password, details.password)
        if (result) {
            var user = await userModel.findOneAndUpdate({
                $or: [{
                    email: identifier
                }, {
                    phoneNumber: identifier
                }]
            }, {
                $push: {
                    ipAddress: host
                }
            })
            return user;
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