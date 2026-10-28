const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const chatController = require('../controllers/chat.controller')


const router = express.Router()

router.post('/', authMiddleware.auth_User_Middleware, chatController.createChat)
router.get('/', authMiddleware.auth_User_Middleware, chatController.getUserChats);
router.get('/:chatId', authMiddleware.auth_User_Middleware, chatController.getChatMessages);
router.delete('/:chatId', authMiddleware.auth_User_Middleware, chatController.deleteChat);

module.exports = router