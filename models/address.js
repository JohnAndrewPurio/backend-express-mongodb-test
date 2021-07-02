const {Schema, model} = require('mongoose')

const AddressSchema = new Schema({
    city: {
        type: String,
        required: true
    },

    pincode: {
        type: Number,
        required: true    
    },

    state: {
        type: String,
        required: true    
    },

    country: {
        type: String,
        required: true    
    },

    addressLine1: {
        type: String,
        required: true    
    },

    addressLine2: {
        type: String,
        required: true    
    },

    label: {
        type: String,
        required: true,
        unique: true 
    }
}, { timestamps: true })

const AddressModel = new model("Address", AddressSchema)

module.exports = AddressModel