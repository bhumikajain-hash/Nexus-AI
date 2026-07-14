const express = require('express')
const cookieParser = require('cookie-parser')
//routes
const authRoutes = require('./routes/auth.routes')
const chatRoutes = require('./routes/chat.routes')

const app = express()
app.use(express.json())
app.use(cookieParser())

//using routes
app.use('/auth', authRoutes)
app.use('/chat', chatRoutes)


module.exports= app