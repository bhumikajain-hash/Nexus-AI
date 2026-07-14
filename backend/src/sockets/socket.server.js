//Here we write the code to initialize the socket server and handle socket events.
const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const aiServices = require('../service/ai.service')
const messageModel = require('../models/message.model')

function initSocketServer(httpServer){

    const io = new Server(httpServer, { /* options */ });
    // middleware to authenticate the socket connection using JWT token from cookies which is used allow only the authenticated users to connect to the socket server.
    
    io.use(async(socket, next)=>{
      const cookies = cookie.parseCookie(socket.handshake.headers.cookie || "");
      if(!cookies){
        return next(new Error('Authentication error ! No token provided'));
      }    
        try{
        const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET_KEY)
        const user = await userModel.findById(decoded.id)

        socket.user = user
        next()

      }catch(err){
        return next(new Error('Authentication error! Invalid token'))
      }
    })
    
    io.on("connection", (socket) => {

      console.log("User connected: ", socket.user)
      console.log("New socket connection : ", socket.id);

      socket.on('ai-message', async(messagePayload)=>{
        console.log('AI message received: ', messagePayload)
        await messageModel.create({
          chat:messagePayload.chat,
          user:socket.user._id,
          content:messagePayload.content,
          roles:"user"
        })
        //const response = "This is a test response from the AI service. The AI service is currently not integrated, so this is a placeholder response."
       
        //creating temporary chathistory
      const chatHistory = await messageModel.find({
      chat:messagePayload.chat
     })

       const response = await aiServices.generateResponse( chatHistory.map(item => {
      return {
        role : item.role,
        parts : [{text : item.content}]

      }
     }))
      
       await messageModel.create({
        chat:messagePayload.chat,
        user:socket.user._id,
        content:response,
        roles:"model"
       })

         socket.emit('ai-response', {
           content: response,
           chat: messagePayload.chat
         })
         console.log('AI response sent: ', response)
       
      })
    });
}

module.exports = initSocketServer
