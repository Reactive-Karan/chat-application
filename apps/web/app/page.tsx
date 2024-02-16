"use client"
// Import necessary dependencies
import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../context/SocketProvider';
import ChatBubble from './components/chat-bubble/Chat-Bubble';
import classes from './page.module.css';




interface Message {
  text: string;
  sender: string;
}

const Page: React.FC = () => {
  const { sendMessage, messages } = useSocket();
  const [currentUser, setCurrentUser] = useState("User")
  const [message, setMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = () => {
    if (message.trim() !== '') {
      sendMessage(message, currentUser);
      setMessage('');
    }
  };

  useEffect(() => {
    // Scroll to the bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        <h1 className="text-lg font-bold mb-4">All Messages will appear here</h1>
        <div className="space-y-4">
          {messages.map((msg: Message, index: number) => (
            <ChatBubble key={index} text={msg.text} sender={msg.sender} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t-2 border-gray-300 flex items-center">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="rounded p-2 mr-2 flex-1"
          placeholder="Type your message..."
        />
        <button onClick={handleSend} className={classes['button']}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Page;
