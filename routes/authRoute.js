const { config } = require('dotenv')

config()

const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { addNewUser, loginUser } = require('../controllers/userController')
const { checkIfTokenExists, storeRefreshToken } = require('../controllers/tokenController')
const { verifyRefreshToken } = require('../helperFunctions/verifyTokens')

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY

router.post('/signup', signUpPostHandler)
router.post('/login', logInPostHandler)
router.get('/token', verifyRefreshToken, tokenGetHandler)

async function tokenGetHandler(request, response) {
    try {
        const { headers } = request
        const refreshToken = headers['authorization'].split(' ')[1]
    
        const result = await checkIfTokenExists(refreshToken, REFRESH_TOKEN_SECRET)
    
        if (result.error) {
            response.statusCode = 403
            response.json(result)
    
            return
        }
        
        const rawData = {
            email: result.email,
            timestamp: Date.now()
        }

        const accessToken = jwt.sign(rawData, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })
        const tokenData = {
            access_token: accessToken,
            access_token_expiry: ACCESS_TOKEN_EXPIRY
        }

        response.json(tokenData)
    } catch(error) {
        // console.log(error)
        response.statusCode = 400
        response.json(error)
    }
}

async function signUpPostHandler(request, response) {
    const { body } = request

    const result = await addNewUser(body)

    if (result.error)
        response.statusCode = 400


    response.json(result)
}

async function logInPostHandler(request, response) {
    const { body } = request

    const result = await loginUser(body)
    const rawData = {
        email: result.user.email,
        timestamp: Date.now()
    }

    if (result.error) {
        response.statusCode = 400
        response.send(result)

        return
    }

    const accessToken = jwt.sign(rawData, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY })

    rawData.refreshToken = true

    const refreshToken = jwt.sign(rawData, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY })

    const tokenStored = await storeRefreshToken(refreshToken, jwt, REFRESH_TOKEN_SECRET)

    if (tokenStored.error) {
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

    response.json(tokenData)
}

module.exports = router