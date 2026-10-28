import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axios from '../api/axiosConfig.js';
import { addMessage, setLoading, addNewChat, setUser, setChats, setMessages } from '../redux/reducer/chatSlice';
import Sidebar from '../components/Sidebar';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import { fetchChatMessages, fetchUserChats } from '../redux/action/chatActions.js';

const Home = () => {
  const dispatch = useDispatch();
  // @ts-ignore
  const { currentChat, messages, loading, user } = useSelector((state) => state.chat);
  
  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default open on desktop
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Fetch user and chats on mount
  useEffect(() => {
    const fetchUserDataAndChats = async () => {
      try {
        const userRes = await axios.get('/auth/profile', { withCredentials: true });
        dispatch(setUser(userRes.data.user));

      // @ts-ignore
      dispatch(fetchUserChats());
      
      } catch (err) {
        console.log("User not logged in");
      }
    };

    fetchUserDataAndChats();
  }, [dispatch]);

  // Socket setup
  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server:', newSocket.id);
    });

    newSocket.on('ai-response', (data) => {
      dispatch(setLoading(false));
      dispatch(addMessage({ 
        content: data.content, 
        roles: 'model', 
        _id: Date.now() 
      }));
    });

    return () => {newSocket.close()};
  }, [dispatch]);

 useEffect(() => {
  if (!currentChat?._id || currentChat._id.startsWith('chat-')) return;

  // @ts-ignore
  dispatch(fetchChatMessages(currentChat._id));
}, [currentChat?._id, dispatch]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to send messages.");
      window.location.href = '/login';
      return;
    }
   if (!inputMessage.trim() || !currentChat || !currentChat._id || currentChat._id.startsWith('chat-')) {
      alert("Please select or create a valid chat first.");
      return;
    }

    const userMessageText = inputMessage;
    dispatch(addMessage({ content: userMessageText, roles: 'user', _id: Date.now() }));
    setInputMessage('');
    dispatch(setLoading(true));

    if (socket) {
      socket.emit('ai-message', {
        chat: currentChat._id,
        content: userMessageText,
      });
    }
  };

  const handleCreateNewChat = async () => {
    if (!user) {
      alert("Please login first to create chats.");
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.post('/chat', {
        title: `Chat Session ${Date.now().toString().slice(-4)}`
      }, { withCredentials: true });

      dispatch(addNewChat(response.data.chat));
    } catch (error) {
      dispatch(addNewChat({ 
        _id: 'chat-' + Date.now(), 
        title: `Chat Session ${Date.now().toString().slice(-4)}` 
      }));
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-100 font-sans overflow-hidden relative">
      
      {/* Mobile Backdrop Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Collapsible Sidebar Wrapper (Collapses width on desktop & slides on mobile) */}
      <div className={`fixed inset-y-0 left-0 z-30 md:relative transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 md:w-0 overflow-hidden'
      }`}>
        <Sidebar isSidebarOpen={isSidebarOpen} />
      </div>

      {/* Main Chat Area - Automatically expands to take full width when sidebar is closed */}
      <div className="flex-1 flex flex-col h-full bg-[#0b0f19] relative overflow-hidden w-full">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-3 md:px-6 bg-[#0f172a]/90 backdrop-blur z-10 shrink-0">
          <div className="flex items-center gap-2 md:gap-3 truncate">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
              title="Toggle Sidebar"
            >
              ☰
            </button>
            <h2 className="text-sm md:text-base font-semibold text-slate-200 truncate max-w-[160px] sm:max-w-xs md:max-w-md">
              {currentChat ? currentChat.title : 'Select or Create a Chat'}
            </h2>
          </div>
          <div className="text-[10px] md:text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-medium flex items-center gap-1.5 shadow-sm shrink-0">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline">Online (RAG Enabled)</span>
            <span className="sm:hidden">Online</span>
          </div>
        </header>

        {/* Message Feed Window */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden w-full p-3 md:p-6 space-y-4 md:space-y-6">
          {!user ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm md:max-w-md mx-auto space-y-4 px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-3xl md:text-4xl text-indigo-400 shadow-2xl">
                🔒
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-100">Authentication Required</h3>
              <p className="text-xs md:text-sm text-slate-400">
                Please log in to your account to start saving chats and querying your vector assistant.
              </p>
              <button 
                onClick={() => window.location.href = '/login'}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-lg text-sm"
              >
                Go to Login
              </button>
            </div>
          ) : !currentChat ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm md:max-w-md mx-auto space-y-4 px-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-3xl md:text-4xl text-indigo-400 shadow-2xl">
                ✨
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-100">Welcome back, {user?.name || 'Explorer'}</h3>
              <p className="text-xs md:text-sm text-slate-400">
                Select a conversation from the sidebar or click <span className="text-indigo-400 font-semibold">+ New Chat</span> to start exploring.
              </p>
              <button 
                onClick={handleCreateNewChat}
                className="mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition shadow-lg text-sm"
              >
                Start New Chat
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm md:max-w-md mx-auto space-y-3 px-4">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-xl md:text-2xl text-indigo-400 shadow-xl">
                💬
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-200">Start the conversation</h3>
              <p className="text-xs md:text-sm text-slate-400">Type your prompt below to query your chat history.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <MessageBubble key={msg._id || index} message={msg} />
            ))
          )}

          {loading && (
            <div className="flex gap-3 md:gap-4 max-w-3xl mx-auto w-full items-center px-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                AI
              </div>
              <div className="bg-[#1e293b] border border-slate-700/50 p-3 md:p-4 rounded-2xl flex items-center gap-2 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Component */}
        <div className="shrink-0 w-full">
          <ChatInput 
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            currentChat={currentChat}
          />
        </div>

      </div>
    </div>
  );
};

export default Home;