const { connection } = require('mongoose')
const UserModel = require('../models/user')
const bcrypt = require('bcrypt')

const validEmail = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

async function addNewUser({name, email, password, profileImage}) {
    if(!validEmail.test(email)) {
        return { error: 'Invalid email' }
    }

    const schema = {
        name: name,
        email: email,
        password: await generatePasswordHash(password),
        profileSrc: profileImage,
    }

    try {
        const user = new UserModel(schema)
        const savedUser = await user.save()

        return savedUser
    } catch(error) {
        return {error}
    }
}

async function loginUser({email, password}) {
    try {
        const user = await connection.collection('users').findOne({email: email})
        
        if(!user) 
            return { error: 'Incorrect Email' }

        const passwordHash = await bcrypt.compare(password, user.password)

        if(!passwordHash) 
            return { error: 'Incorrect Password' }

        return {user, passwordHash}
    } catch(error) {
        return { error: error }
    }
}

async function getAllUsers() {
    try {
        const users = connection.collection('users').find().toArray()

        return users
    } catch(e) {
        console.log(e)
    }
}

async function generatePasswordHash(password) {
    try {
        const hash = await bcrypt.hash(password, 10)

        return hash
    } catch(e) {
        console.log(e)
    }
}

module.exports = {
    addNewUser, getAllUsers, loginUser
}