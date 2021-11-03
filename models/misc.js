var bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer")
const os = require("os")
const crypto = require("crypto")


var sendMail = exports.sendMail = async (mail) => {
    var account = ""
    var password = ""

    var transporter = nodemailer.createTransport({
        host: os.hostname(),
        port: '',
        secure: '',
        auth: {
            user: account,
            pass: password
        }
    })
    try {
        var info = await transporter.sendMail({
            from: ` User Admin<${account}>`,
            to: `${mail.email}`,
            subject: `${mail.subject}`,
            text: `${mail.text}`,

        })
    } catch (error) {
        throw error;
    }


}
var generateToken = exports.generateToken = async function (data) {
    var secretKey = "This is True";
    var data = data;
    var token = jwt.sign(data, secretKey, {
        expiresIn: '1800s'
    })
    return token;
}

exports.verifyToken = async function (token) {
    var secretKey = "This is True";
    try {
        data = jwt.verify(token, secretKey)
        return data
    } catch (error) {
        throw error
    }
}

exports.hashPassword = async function (password) {
    var salt = await bcrypt.genSalt(10)
    try {
        var hash = await bcrypt.hash(password, salt);
        return hash
    } catch (error) {
        // ! handle errors in mongoose
        console.log(error)
    }
}

exports.comparePassword = async function (password, hash) {
    var result = await bcrypt.compare(password, hash)
    return result;
}

exports.sendCodeMail = async function (userdetails) {
    console.log(userdetails);
    var secretCode = generateSecretCode()

    var mail = {};
    mail.code = secretCode
    mail.to = userdetails.email;
    mail.subject = 'Verify Email'
    var token = await generateToken(userdetails)


    const message = `
    Use the following URL to sign in: 
    http://${os.hostname()}/verify/token?${token}`
    mail.mail = message

    sendMail(mail);

}

var generateSecretCode = exports.generateSecretCode = () => {
    return crypto.randomBytes(6).toString('utf-8')
}