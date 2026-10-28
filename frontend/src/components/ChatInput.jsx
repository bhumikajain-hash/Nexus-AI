import React from 'react';

const ChatInput = ({ inputMessage, setInputMessage, handleSendMessage, currentChat }) => {
  return (
    <div className="p-3 md:p-4 bg-[#0f172a] border-t border-slate-800 shrink-0">
      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto relative flex items-center">
        <input 
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={!currentChat}
          placeholder={currentChat ? "Type your prompt or question here..." : "Select or create a chat first..."}
          className="w-full bg-[#1e293b] border border-slate-700/60 rounded-xl py-3 pl-3.5 pr-12 md:py-3.5 md:pl-4 md:pr-14 text-xs md:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button 
          type="submit"
          disabled={!inputMessage.trim() || !currentChat}
          className="absolute right-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white p-1.5 md:p-2 rounded-lg transition shadow-md flex items-center justify-center"
        >
          🚀
        </button>
      </form>
      <p className="text-center text-[10px] md:text-xs text-slate-500 mt-2 truncate">
        AI can make mistakes. Chats are securely saved to your account.
      </p>
    </div>
  );
};

export default ChatInput;