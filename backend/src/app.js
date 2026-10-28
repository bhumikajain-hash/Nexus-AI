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
    'https://nexusai-ai-1-jnf3.onrender.com' // Your live Render frontend URL
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman or server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS policy violation'), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json())
app.use(cookieParser())

//using routes
app.use('/auth', authRoutes)
app.use('/chat', chatRoutes)


module.exports= app