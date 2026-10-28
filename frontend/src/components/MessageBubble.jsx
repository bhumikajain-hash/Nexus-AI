import React from 'react';

const MessageBubble = ({ message }) => {
  const isUser = message.roles === 'user';

  return (
    <div className={`flex gap-2 md:gap-4 max-w-3xl mx-auto w-full px-2 md:px-0 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md">
          AI
        </div>
      )}

      {/* Message Content Box */}
      <div 
        className={`p-3 md:p-4 rounded-2xl text-xs md:text-sm leading-relaxed max-w-[85%] md:max-w-[75%] break-words ${
          isUser 
            ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/10' 
            : 'bg-[#1e293b] text-slate-200 border border-slate-700/50 rounded-bl-none shadow-lg'
        }`}
      >
        {message.content}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md">
          B
        </div>
      )}
    </div>
  );
};

export default MessageBubble;