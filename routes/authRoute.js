const { config } = require('dotenv')

config()

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { addNewUser, loginUser } = require('../controllers/userController')
const { storeRefreshToken } = require('../controllers/tokenController')

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY

const refreshTokens = []

router.post('/signup', signUpPostHandler)

router.post('/login', logInPostHandler)

async function signUpPostHandler(request, response) {
    const { body } = request

    const result = await addNewUser(body)

    console.log(result, body)

    if (result.error) {
        response.statusCode = 400
        response.send(result.error)

        return
    }

    response.json(result)
}

async function logInPostHandler(request, response) {
    const { body } = request

    const result = await loginUser(body)
    const rawData = {
        email: result.user.email,
        timestamp: Date.now()
    }

    if(result.error) {
        response.statusCode = 400
        response.send(result)

        return
    }

    const accessToken = jwt.sign(rawData, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })

    rawData.refreshToken = true

    const refreshToken = jwt.sign(rawData, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY })

    const tokenStored = await storeRefreshToken(refreshToken, jwt, REFRESH_TOKEN_SECRET)

    if(tokenStored.error) {
        response.statusCode = 401
        response.send(tokenStored.error)

        return
    }
    
    const tokenData = {
        access_token: accessToken,
        refresh_token: refreshToken,
        access_token_expiry: ACCESS_TOKEN_EXPIRY,
        refresh_token_expiry: REFRESH_TOKEN_EXPIRY
    }

    response.json( tokenData )
}

module.exports = router