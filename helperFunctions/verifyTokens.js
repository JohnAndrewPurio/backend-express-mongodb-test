const { config } = require('dotenv')

config()

const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET

async function verifyAccessToken(request, response, next) {
    const { headers } = request
    const accessToken = headers['authorization'].split(' ')[1]

    try {
        const verify = await jwt.verify(accessToken, SECRET_KEY)

        next()
    } catch(error) {
        response.statusCode = 403
        response.send(error)
    }
    
}

async function verifyRefreshToken(request, response, next) {
    const { headers } = request
    const refreshToken = headers['authorization'].split(' ')[1]

    try {
        const verify = await jwt.verify(refreshToken, REFRESH_SECRET)

        next()
    } catch(error) {
        response.statusCode = 403
        response.send(error)
    }
}

module.exports = {
    verifyAccessToken, verifyRefreshToken
}