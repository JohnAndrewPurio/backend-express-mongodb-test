const {Schema, SchemaTypes, model} = require('mongoose')

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    locations: {
        type: [SchemaTypes.ObjectId],
        ref: 'Address'
    }

}, {timestamps: true,})

const UserModel = new model("User", UserSchema)

module.exports = UserModel