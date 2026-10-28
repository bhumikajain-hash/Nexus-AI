const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
//routes
const authRoutes = require('./routes/auth.routes')
const chatRoutes = require('./routes/chat.routes')

const app = express()

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://nexus-ai-1-jnf3.onrender.com'
];

// Clean and safe standard array configuration for CORS
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json())
app.use(cookieParser())

//using routes
app.use('/auth', authRoutes)
app.use('/chat', chatRoutes)


module.exports= app