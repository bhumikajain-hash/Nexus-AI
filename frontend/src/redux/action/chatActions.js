import axiosConfig from '../../api/axiosConfig';
import { setChats, setMessages } from '../reducer/chatSlice';
import toast from 'react-hot-toast';

// Async action to fetch all chat sessions for the user
export const fetchUserChats = () => async (dispatch) => {
    try {
        const response = await axiosConfig.get('/chat',{ withCredentials: true }); // Adjust endpoint as needed
        dispatch(setChats(response.data.chats));
    } catch (error) {
        console.error("Error fetching chats:", error);
        toast.error("Failed to load chat history");
    }
};

// Async action to fetch messages for a specific chat room
export const fetchChatMessages = (chatId) => async (dispatch) => {
    try {
        const response = await axiosConfig.get(`/chat/${chatId}`, { withCredentials: true }); // Adjust endpoint as needed
        dispatch(setMessages(response.data.messages || []));
    } catch (error) {
        console.error("Error fetching messages:", error);
        dispatch(setMessages([]));
        toast.error("Failed to load messages");
    }
};