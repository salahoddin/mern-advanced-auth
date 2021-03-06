require('dotenv').config({
	path: './config.env',
})
const connectDB = require('./backend/config/db')
const userRoutes = require('./backend/routes/userRoutes')
const privateRoutes = require('./backend/routes/privateRoutes')
const errorHandler = require('./backend/middlewares/error')

connectDB()

const express = require('express')

const app = express()

app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/private', privateRoutes)

// error handler should be last piece of middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => console.log(`server running on ${PORT}`))

process.on('unhandledRejection', (error, promise) => {
	console.log(`Logged error ${error}`)
	server.close(() => process.exit(1))
})
