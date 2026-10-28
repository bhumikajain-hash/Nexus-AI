import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChat, setMessages, addNewChat, deleteChat, logoutUser } from '../redux/reducer/chatSlice';
import axios from '../api/axiosConfig.js';
import { fetchChatMessages } from '../redux/action/chatActions';
import { toast } from 'react-hot-toast';

const Sidebar = ({ isSidebarOpen }) => {
  const dispatch = useDispatch();
  // @ts-ignore
  const { chats, currentChat, user } = useSelector((state) => state.chat);

  const handleCreateNewChat = async () => {
    if (!user) {
      alert("Please login first to create and save chats.");
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.post('/chat', {
        title: `Chat ${chats.length + 1}: New Topic`
      }, { withCredentials: true });

      dispatch(addNewChat(response.data.chat || { 
        _id: 'chat-' + Date.now(), 
        title: `Chat ${chats.length + 1}: Conversation` 
      }));
    } catch (error) {
      dispatch(addNewChat({ 
        _id: 'chat-' + Date.now(), 
        title: `Chat ${chats.length + 1}: Conversation` 
      }));
    }
  };


const handleSelectChat = (chat) => {
  dispatch(setCurrentChat(chat)); // Home.jsx's useEffect will automatically catch this and fetch messages!
};

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Prevent triggering chat selection
    if (!window.confirm("Are you sure you want to delete this chat?")) return;

    try {
      await axios.delete(`/chat/${chatId}`, { withCredentials: true });
      dispatch(deleteChat(chatId));
    } catch (err) {
      console.error("Error deleting chat from backend", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout', {}, { withCredentials: true });
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout error", err);
      toast.error("Logged out locally");
    }
    dispatch(logoutUser());
 
  };

  const getUserName = () => {
    if (!user) return 'Guest User';
    if (user.fullName?.firstName) {
      return `${user.fullName.firstName} ${user.fullName.lastName || ''}`.trim();
    }
    return user.name || 'User';
  };

  const getInitial = () => {
    const name = getUserName();
    return name !== 'Guest User' ? name[0].toUpperCase() : 'U';
  };

  return (
    <div 
      className={`w-72 flex flex-col h-full bg-[#1e293b] border-r border-slate-700/50 shrink-0 select-none`}
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent truncate">
          NexusAI Assistant
        </h1>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button 
          onClick={handleCreateNewChat}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-4 rounded-xl font-medium transition shadow-lg shadow-indigo-500/20 text-sm"
        >
          <span>+</span> New Chat
        </button>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar">
        <div className="text-xs font-semibold text-slate-400 px-3 py-2 uppercase tracking-wider">
          Recent Chats
        </div>
        
        {chats.length === 0 ? (
          <p className="text-xs text-slate-500 px-3 py-2">No saved conversations yet.</p>
        ) : (
          chats.map((chat) => (
            <div 
              key={chat._id}
              onClick={() => handleSelectChat(chat)}
              className={`group flex items-center justify-between w-full px-3 py-2.5 rounded-xl cursor-pointer text-sm transition ${
                currentChat?._id === chat._id 
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <span className="truncate flex-1">💬 {chat.title}</span>
              <button
                onClick={(e) => handleDeleteChat(e, chat._id)}
                className="opacity-100 md:opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 p-1 rounded transition"
                title="Delete Chat"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-700/50 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-3 truncate mr-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow shrink-0">
           {getInitial()}
          </div>
          <div className="truncate">
            <p className="text-sm font-medium text-slate-200 truncate">{getUserName()}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email || 'Please login'}</p>
          </div>
        </div>
        {user ? (
          <button 
            onClick={handleLogout}
            title="Logout"
            className="text-xs bg-indigo-600 hover:bg-red-500 text-white p-2 rounded-lg transition shrink-0"
          >
            Logout
          </button>
        ) : (
          <button 
            onClick={() => window.location.href = '/login'}
            className="text-xs bg-indigo-600  hover:bg-green-500  px-2.5 py-1.5 rounded-lg text-white shrink-0 font-medium"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;