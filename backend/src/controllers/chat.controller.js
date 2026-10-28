const chatModel = require('../models/chat.model')
const messageModel = require('../models/message.model')

async function createChat(req,res) {
    const {title} = req.body
    const user = req.user
    const chat = await chatModel.create({
        user:user._id,
        title
    })

    res.status(201).json({
        message:"Chat Created Successfully",
        chat:{
            _id:chat._id,
            title:chat.title,
            lastActivity: chat.lastActivity
        
        }
        })
    }

    async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;
        
        // 1. Delete the chat document itself
        const deletedChat = await chatModel.findOneAndDelete({ _id: chatId, user: req.user._id });
        if (!deletedChat) {
            return res.status(404).json({ message: "Chat not found or unauthorized" });
        }

        // 2. Clean up and delete all messages belonging to this chat
        await messageModel.deleteMany({ chat: chatId });

        return res.status(200).json({ message: "Chat deleted successfully" });
    } catch (error) {
        console.error("Error deleting chat:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

    async function getUserChats(req, res) {
    try {
        const chats = await chatModel.find({ user: req.user._id }).sort({ updatedAt: -1 });
        return res.status(200).json({ chats: chats || [] });
    } catch (error) {
        console.error("Error fetching user chats:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

async function getChatMessages(req, res) {
    try {
        const { chatId } = req.params;
        console.log('👉 Fetching messages for URL chatId:', chatId);
        // 1. Verify the chat exists
        const chat = await chatModel.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // 2. Fetch messages belonging to this chat safely
        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 }).lean();
        console.log('👉 Found messages in DB:', messages.length);
        return res.status(200).json({
            messages: messages || []
        });
    } catch (error) {
        console.error("Error in getChatMessages:", error);
        // Instead of a crashing 500 server error, return an empty array for corrupted/old IDs
        return res.status(200).json({ messages: [] });
    }
}

module.exports = {
    createChat,
    getUserChats,
    deleteChat,
    getChatMessages 
}