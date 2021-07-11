const { connection, mongo } = require('mongoose')
const AddressModel = require('../models/address')
const UserModel = require('../models/user')

async function addNewLocation(email, location) {
    try {
        const userFound = await UserModel.findOne({ email })
        location.user = userFound
        const address =  new AddressModel(location)
        await address.save()

        await UserModel.updateOne({ email }, { $push: { locations: address } })
        
        return address
    } catch (error) {
        return { error: error }
    }
}

async function getAllLocations(email) {
    try {
        const { locations } = await UserModel.findOne({ email })

        const result = []

        for(let index = 0; index < locations.length; index++) {
            const address = mongo.ObjectId(locations[index])

            result.push( await AddressModel.findOne( { _id: address } ) )
        }

        return result
    } catch (error) {
        return { error: error }
    }
}

async function deleteLocation(email, location) {
    try {
        const locationId = mongo.ObjectId(location)
        const userFound = await UserModel.updateOne({ email }, { $pull: { locations: locationId } })
        await AddressModel.deleteOne( { _id: locationId } )

        return {
            message: 'Address Deleted'
        }
    } catch (error) {
        return { error: error }
    }
}

async function patchLocation(email, location, patch) {
    try {
        const locationId = mongo.ObjectId(location)
        const userFound = await UserModel.findOne( { email } )
        await AddressModel.updateOne({ _id: locationId }, patch)

        return {
            message: 'Address Updated'
        }
    } catch (error) {
        return { error: error }
    }
}

module.exports = {
    addNewLocation, getAllLocations, deleteLocation, patchLocation
}