const { config } = require('dotenv')
config()

const express = require('express')
const { addNewLocation, getAllLocations } = require('../controllers/addressController')
const router = express.Router()
const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET

router.use(express.urlencoded({ extended: true }))

router
    .route('/')
    .get(getLocationsHandler)
    .post(postNewLocation)

async function getLocationsHandler(request, response) {
    const { headers } = request
    const accessToken = headers['authorization'].split(' ')[1]

    try {
        const { email } = await jwt.verify(accessToken, SECRET_KEY)
        const result = await getAllLocations(email)

        response.json(result)
    } catch (error) {
        response.statusCode = 403
        response.json({ error })
    }
}

async function postNewLocation(request, response) {
    const { body, headers } = request
    const accessToken = headers['authorization'].split(' ')[1]

    try {
        const { email } = await jwt.verify(accessToken, SECRET_KEY)
        body.pincode = Number(body.pincode)

        const result = await addNewLocation(email, body)

        if (result.error) {
            response.statusCode = 400
        }

        response.json(result)
    } catch (error) {
        response.statusCode = 401
        response.json({ error })
    }
}

module.exports = router