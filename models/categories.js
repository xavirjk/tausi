const mongoose = require("mongoose")

const {
    Schema
} = mongoose;

const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    categoryPics: [{
        location: {
            type: String
        }
    }]
})

const {
    method,
    static
} = categorySchema;

method.findCategoryName = async function () {
    return
}


const categoryModel = mongoose.model("CATEGORY", categorySchema)
module.exports = categoryModel;