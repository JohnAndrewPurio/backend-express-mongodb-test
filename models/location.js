const {Schema, SchemaTypes, model} = require('mongoose')

const LocationSchema = new Schema({
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },

    location: {
        type: [SchemaTypes.ObjectId],
        ref: 'Address'
    }
    
}, { timestamps: true })

const LocationModel = new model("Location", LocationSchema)

module.exports = LocationModel