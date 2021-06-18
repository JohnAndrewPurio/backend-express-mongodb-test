const {Schema, model} = require('mongoose')

const TokenSchema = new Schema({
    token: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
}, {timestamps: true,})

const TokenModel = new model("Token", TokenSchema)

module.exports = TokenModel