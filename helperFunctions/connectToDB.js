const {connect} = require('mongoose')
const { config } = require('dotenv')

config()

// const mongodb_url = 'mongodb://127.0.0.1:27017/'
const mongodb_url = process.env.MONGO_DB_URL

async function connectToDB(database) {
    await connect(mongodb_url + database, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
}

module.exports = connectToDB