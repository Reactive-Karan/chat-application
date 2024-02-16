import React from 'react';

interface IChatBubble {
  text: string,
  sender: string
}

const ChatBubble: React.FC<IChatBubble> = ({ text, sender }) => {
  return (
    <div
      className={`${sender === 'user' ? 'bg-chatBubble' : 'bg-gray-300'
        } p-4 rounded-lg mb-4 ml-4`}
    >
      <p className={`${sender === 'user' ? 'text-chatText' : 'text-gray-800'}`}>
        {text}
      </p>
    </div>
  );
};

export default ChatBubble;