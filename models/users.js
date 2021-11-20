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
        // required: function () {
        //     if (this.phoneNumber.length == 0) {
        //         return false
        //     }
        //     return true
        // },
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: Number,
        // required: function () {
        //     if (this.phoneNumber) {
        //         return false
        //     }
        //     return true
        // }
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

        if (!this.phoneNumber && !this.email) {
            next('input phoneNumber and/or email')
        }
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
// ! review this. create seperate functions to deal with each scenario.

user.pre('findOneAndUpdate', async function (next) {
    try {
        //check if there is a password to prevent it from being updated
        if (this._update.password || this._update.email || this._update.phoneNumber) {
            next("Cannot such personal details")
        }
        // // ! why is this necessary
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
    if (identifier instanceof Number) {
        var userResults = await userModel.findOneAndUpdate({
            phoneNumber: identifier
        }, {
            "deleted.status": true,
            "deleted.when": Date.now()
        }, {
            new: true
        }).select('deleted')
    } else {
        var userResults = await userModel.findOneAndUpdate({
            email: identifier
        }, {
            "deleted.status": true,
            "deleted.when": Date.now()
        }, {
            new: true
        }).select('deleted')
    }

    if (userResults) {
        return userResults
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
        if (identifier instanceof Number) {
            var details = await userModel.findOne({
                phoneNumber: identifier
            }).select("password")
        } else {
            var details = await userModel.findOne({
                email: identifier
            }).select("password")
        }
        // console.log(details)
        if (!details) {
            return false
        }
        var result = await comparePassword(password, details.password)
        // console.log(result)

        if (result) {
            if (identifier instanceof Number) {
                var userResults = await userModel.findOneAndUpdate({
                    phoneNumber: identifier
                }, {
                    $push: {
                        ipAddress: host
                    }
                }).select("firstName lastName email phoneNumber registered");
                return userResults;
            } else {
                var userResults = await userModel.findOneAndUpdate({
                    email: identifier
                }, {
                    $push: {
                        ipAddress: host
                    }
                }).select("firstName lastName email phoneNumber registered");
                return userResults;
            }

        }

        return false
    } catch (error) {
        throw error
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
    email = email.toLowerCase();
    var details = await this.findOne({
        email
    }).select("firstName lastName email phoneNumber registered");
    return details;
}



const userModel = mongoose.model('USERS', user)

module.exports = userModel;