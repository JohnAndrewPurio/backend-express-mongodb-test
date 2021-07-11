const { config } = require('dotenv')
config()

const express = require('express')
const { deleteLocation, patchLocation } = require('../controllers/addressController')
const router = express.Router()
const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET

router.use(express.urlencoded({ extended: true }))

router
    .route('/:id')
    .delete(deleteLocationRequest)
    .patch(patchLocationRequest)

async function deleteLocationRequest(request, response) {
    try {
        const { params, headers } = request

        const accessToken = headers.authorization.split(' ')[1]
        const { email } = await jwt.verify(accessToken, SECRET_KEY)
        const result = await deleteLocation(email, params.id)

        if (result.error)
            response.statusCode = 401

        response.json(result)
    } catch (error) {
        console.log(error)
        response.statusCode = 401
        response.json({ error })
    }
}

async function patchLocationRequest(request, response) {
    const { body, headers, params } = request
    const accessToken = headers['authorization'].split(' ')[1]

    try {
        const { email } = await jwt.verify(accessToken, SECRET_KEY)
        const result = await patchLocation(email, params.id, body)

        if(result.error) {
            response.statusCode = 401
            response.json(result)

            return
        }

        response.json(result)
    } catch (error) {
        return { error: error }
    }
}

module.exports = router