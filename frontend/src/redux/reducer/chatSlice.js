import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, // Holds real user info from backend
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
      //state.messages = action.payload?.messages || [];
    },
    addNewChat: (state, action) => {
      state.chats.unshift(action.payload);
      state.currentChat = action.payload;
      state.messages = [];
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.chats = [];
      state.currentChat = null;
      state.messages = [];
    },
    deleteChat: (state, action) => {
        state.chats = state.chats.filter(chat => chat._id !== action.payload);
        if (state.currentChat?._id === action.payload) {
          state.currentChat = null;
          state.messages = [];
        }
      }
  },
});

export const { 
  setUser, 
  setChats, 
  setCurrentChat, 
  addNewChat, 
  setMessages, 
  addMessage, 
  setLoading, 
  logoutUser,
  deleteChat 
} = chatSlice.actions;

export default chatSlice.reducer;