const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const port = 4000
const connectToDB = require('./helperFunctions/connectToDB')
const authRouter = require('./routes/authRoute')
const addressRouter = require('./routes/addressRoute')

connectToDB('addressManagementSystem')

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

app.use('/users', authRouter)
app.use('/addresses', addressRouter)

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`)
})


