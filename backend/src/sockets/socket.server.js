//Here we write the code to initialize the socket server and handle socket events.
const { Server } = require("socket.io");
const cookie = require('cookie')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')
const chatModel = require('../models/chat.model')
const aiServices = require('../service/ai.service')
const messageModel = require('../models/message.model')
const {createMemory , queryMemory} = require('../service/vector.service')

function initSocketServer(httpServer){

  const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://nexus-ai-1-jnf3.onrender.com" // Your live Render frontend URL
    ];

    const io = new Server(httpServer, {
      cors: {
        origin: function (origin, callback) {
          // Allow non-browser tools or matching origins
          if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        methods: ["GET", "POST"],
        credentials: true
      }
    });
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
       /* Here two different process : 1.saving message in db and 2. generate vectors are taking separate time of completion meaans 1st complete then 2nd starts

        // messageModel is used to save the messages in mongodB. 
        const message = await messageModel.create({
          chat:messagePayload.chat,
          user:socket.user._id,
          content:messagePayload.content,
          roles:"user"
        })

        //dummy response
        //const response = "This is a test response from the AI service. The AI service is currently not integrated, so this is a placeholder response."
       
       //converting messages into vectors to implement long term memory and store it in vector database(using pinecone)

        const vectors = await aiServices.generateVector(messagePayload.content)
        */

        //therefore we use promise.all which starts the both process simultaneously which saves the time

        const [message, vectors] = await Promise.all([
          messageModel.create({
          chat:messagePayload.chat,
          user:socket.user._id,
          content:messagePayload.content,
          roles:"user"
        }),
        aiServices.generateVector(messagePayload.content)

        ])
        //console.log(vectors)
        await chatModel.findByIdAndUpdate(messagePayload.chat, {
  $push: { messages: message._id },
  lastActivity: Date.now()
});

         //here we are saving the vectors into pinecone (vector database)
       try {
    await createMemory({
        vectors : vectors,
        messageId: message._id,
        metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: messagePayload.content
        }
    });
} catch (err) {
    console.error("Pinecone Upsert failed, but continuing:", err);
}

        const [memory, chatHistory] = await Promise.all([
          queryMemory({
          queryVector: vectors,
          limit: 1,
          metadata:{
            user:socket.user._id
          }
        }),

        messageModel.find({
      chat:messagePayload.chat
     }).sort({createdAt:-1}).limit(10).lean()

        ])
        chatHistory.reverse(); 

        //checking whose chat vector we created is related to our vector database memory if yes then retrieve it
        // const memory = await queryMemory({
        //   queryVector: vectors,
        //   limit: 1,
        //   metadata:{
        //     user:socket.user._id
        //   }
        // })

       
        //console.log(vectors)

        //get chathistory from mongodb database
    //   const chatHistory = (await messageModel.find({
    //   chat:messagePayload.chat
    //  }).sort({createdAt:-1}).limit(10).lean()).reverse()

     const stm =  chatHistory.map(item => {
      return {
        role : item.roles,
        parts : [{text : item.content}]

      }
     })

     const ltm = [
      {
        role:"user",
        parts: [{text:`
          these are some previous messages from the chat , use them to generate response
          ${memory.map(item => item.metadata.text).join("\n")}`}]
      }
     ]

    const response = await aiServices.generateResponse([...ltm, ...stm] )

            socket.emit('ai-response', {
           content: response,
           chat: messagePayload.chat
         })
         console.log('AI response sent: ', response)


    const [responseMessage, responseVectors] = await Promise.all([
      messageModel.create({
      chat:messagePayload.chat,
      user:socket.user._id,
      content:response,
      roles:"model"
     }),
     aiServices.generateVector(response)
    ])

    // const responseMessage =  await messageModel.create({
    //   chat:messagePayload.chat,
    //   user:socket.user._id,
    //   content:response,
    //   roles:"model"
    //  })
     
    //  const responseVectors = await aiService.generateVector(response)
    await chatModel.findByIdAndUpdate(messagePayload.chat, {
      $push: { messages: responseMessage._id },
      lastActivity: Date.now()
    });
     await createMemory({
      vectors : responseVectors,
      messageId : responseMessage._id,
      metadata: {
        chat: messagePayload.chat,
        user: socket.user._id,
        text: response
      }
     })

       
       
      })
    });
}

module.exports = initSocketServer
