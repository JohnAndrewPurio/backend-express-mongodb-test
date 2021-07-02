const { connection, mongo } = require('mongoose')
const AddressModel = require('../models/address')
const LocationModel = require('../models/location')

async function addNewAddress(schema) {
    try {
        const address = new AddressModel(schema)
        const savedAddress = await address.save()

        return savedAddress
    } catch(error) {
        console.log(error)

        return { error }
    }
}

async function addNewLocation(email, address) {
    try {
        const userFound = await connection.collection('users').findOne({ email: email })


        if(!userFound) {
            return {
                error: 'Invalid email'
            }
        }

        const addressObject = await addNewAddress(address)

        const schema = {
            user: userFound,
            address: [addressObject]
        }

        let locationCollection = await connection.collection('locations').findOne({ user: userFound })

        console.log(locationCollection)
        if(!locationCollection) {
            const newLocation = new LocationModel(schema)
            await newLocation.save()

            locationCollection = await connection.collection('locations').findOne({ user: userFound })
        }
        
        const update = await locationCollection.update({ user: userFound }, { $push: addressObject }, { new: true })

        console.log('Update:', update, addressObject)

        return 'Location added'
    } catch(error) {
        console.log(error)

        return { error }
    }
}


async function getAllLocations( email ) {
    try {
        const userFound = await connection.collection('users').findOne({ email: email })
        const userId = mongo.ObjectId(userFound._id)

        const locationData = await connection.collection('locations').findOne({ user: userId })
        const location = locationData.location
        
        console.log(locationData)

        const resultArr = []

        for( let index = 0; index < location.length; index++ ) {
            const address = location[index]
            const data = await connection.collection('addresses').findOne( { _id: mongo.ObjectId(address) } )

            resultArr.push( data )
        }

        return resultArr
    } catch(error) {
        console.log(error)

        return { error }
    }
}

module.exports = {
    addNewLocation, getAllLocations
}