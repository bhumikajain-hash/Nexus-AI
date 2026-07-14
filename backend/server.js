require('dotenv').config()
const app = require('./src/app')
const connectdB = require('./src/db/db')
const initSocketServer = require('./src/sockets/socket.server')
const { createServer } = require("http");
// Here we create an HTTP server and pass the Express app to it. This allows us to use the same server for both HTTP and WebSocket connections.
const httpServer = createServer(app);
initSocketServer(httpServer);

connectdB()
// Start the HTTP server and listen on port 3000 . Socket.io will use this server to handle WebSocket connections.
httpServer.listen(3000,()=>{
    console.log('Server is running on port 3000')
} )