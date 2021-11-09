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
    methods,
    statics
} = categorySchema;

statics.findCategoryName = async function (categoryName) {
    var details = await categoryModel.findOne({categoryName})
    return details
}


const categoryModel = exports.categoryModel =  mongoose.model("CATEGORY", categorySchema);