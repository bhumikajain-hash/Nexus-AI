const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chats',
        required:true
    },
    content: {
        type:String,
        required:true
    },
    roles:{
        type:String,
        enum :["user", "model","system"],
        default:"user"
    }
},{
    timestamps:true
})

const messageModel = mongoose.model('Messages', messageSchema)
module.exports = messageModel