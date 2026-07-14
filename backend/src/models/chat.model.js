const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    user:{

        type:mongoose.Schema.Types.ObjectId,
        //ref main users collection ko show karta hai jiski id hum use kar rahe hai
        ref:'Users',
        required:true
    },
    title:{
        type:String,
        required:true
    },
    lastActivity:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
})

const chatModel = mongoose.model('Chats', chatSchema)

module.exports = chatModel