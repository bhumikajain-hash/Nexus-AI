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
    'https://nexusai-ai-1-jnf3.onrender.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
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