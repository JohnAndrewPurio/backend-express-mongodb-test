const { connection, mongo } = require('mongoose')
const AddressModel = require('../models/address')
const LocationModel = require('../models/location')

async function addNewAddress(schema) {
    try {
        const address = new AddressModel(schema)
        const savedAddress = await address.save()

        return savedAddress
    } catch(error) {
        return { error }
    }
}

async function addNewLocation(email, address) {
    try {
        const userFound = connection.collection('location').findOne({ email: email })

        if(!userFound) {
            return {
                error: 'Invalid email'
            }
        }

        const addressObject = await addNewAddress(address)
        const userId = mongo.ObjectId(userFound._id) 

        // const foundLocation = connection.collection('location').findOne({ _id: userId })

        const schema = {
            user: await connection.collection('users').findOne({ email: email }),
            location: addressObject
        }

        console.log(schema)

        const location = new LocationModel(schema)
        const savedLocation = await location.save()

        return savedLocation
    } catch(error) {
        console.log(error)

        return { error }
    }
}


async function getAllLocations( email ) {
    try {
        const userFound = await connection.collection('users').findOne({ email: email })
        const userId = mongo.ObjectId(userFound._id)

        const result = await connection.collection('locations').findOne({ user: userId })

        const resultArr = result.location.map( async (address) => {
            const data = await connection.collection('addresses').findOne( { _id: mongo.ObjectId(address) } ) 
            const addressEle = await data
            // console.log(data)

            return addressEle
        }) 
        
        console.log(resultArr)

        // return result
        return resultArr
    } catch(error) {
        console.log(error)

        return { error }
    }
}

module.exports = {
    addNewLocation, getAllLocations
}