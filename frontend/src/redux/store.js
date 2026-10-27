import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './reducer/chatSlice';

export const store = configureStore({
    reducer: {
        chat: chatReducer,
    },
});