const { connection } = require('mongoose')
const jwt = require('jsonwebtoken')
const TokenModel = require('../models/token')

async function storeRefreshToken(refreshToken, jwt, secret) {
    try {
        const { email } = await jwt.verify(refreshToken ,secret)
        const user = await connection.collection('tokens').deleteOne({email: email})

        const schema = {
            token: refreshToken,
            email: email 
        }

        const token = new TokenModel(schema)
        const savedToken = await token.save()

        return savedToken
    } catch(error) {
        return { error }
    }
}

async function checkIfTokenExists(refreshToken, secret) {
    try {
        const { email } = await jwt.verify(refreshToken, secret)
        const token = await connection.collection('tokens').findOne({email: email})

        return token
    } catch(error) {
        return { error }
    }
}

module.exports = {
    storeRefreshToken, checkIfTokenExists
}