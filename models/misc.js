var bcrypt = require("bcryptjs")

exports.hashPassword = async function (password){
    var salt = await bcrypt.genSalt(10)
    try {
        var hash = await bcrypt.hash(password,salt);
        return hash 
    } catch (error) {
        // ! handle errors in mongoose
        console.log(error)
    }

}

exports.comparePassword = async function(password,hash){
    var result =  await bcrypt.compare(password,hash)
    return result;
}

exports.sendCodeMail = async function(userdetails){
    console.log(userdetails);
}