const mongoose = require("mongoose");


// Create a Schema for our mealkits collection
const mealkitsSchema = new mongoose.Schema({

     title: {
        type: String,
        required: true
     },
     includes: {
        type: String,
        required: true        
     },
     description: {
        type: String,
        required: true
     },
     category: {
        type: String,
        required: true
     },
     price: {
        type: Number,
        required: true
     },
     cookingTime: {
        type: Number,
        required: true
     },
     servings: {
        type: Number,
        required: true
     },
     imageUrl: {
        type: String,
        required: true
     },
     featuredMealKit: {
        type: Boolean,
        required: true
     }
});


// Create a model using the nameSchema Schema
const mealkitsModel = mongoose.model("mealkits", mealkitsSchema);

module.exports = mealkitsModel;