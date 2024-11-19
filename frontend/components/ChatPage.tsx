import React, { useState, useEffect } from "react";
import axios from "axios";
import '../../public/ChatPage.css';
interface Message {
  sender: {
    name: string;
    role: string;
  };
  text: string;
}

const ChatPage: React.FC<{ userId: string }> = ({ userId }) => {
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch or create chat dynamically
    const fetchChat = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pchats/${userId}`);
        setChatId(response.data._id);
        setMessages(response.data.messages || []); // Safeguard against null/undefined
      } catch (error) {
        console.error("Error fetching chat:", error);
        setMessages([]); // Ensure messages is an empty array in case of error
      }
    };

    fetchChat();
  }, [userId]);

  const handleSendMessage = async () => {
    if (message.trim() && chatId) {
      try {
        const response = await axios.post(`http://localhost:5000/api/pchats/${chatId}`, {
          senderId: userId,
          text: message,
        });
        setMessages(response.data.messages);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {/* Add a check before mapping */}
        {messages && messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender.role === "professional" ? "professional" : "standard"
              }`}
            >
              <span className="sender">{msg.sender.name}:</span>
              <span>{msg.text}</span>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
