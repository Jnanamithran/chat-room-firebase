import { useState, useEffect } from "react";
import { db, auth } from "../firebase-config.jsx";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import "../styles/Chat.css";

export const Chat = ({ room, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    if (!room) return;

    try {
      const queryMessages = query(
        messagesRef,
        where("room", "==", room),
        orderBy("createdAt", "asc")
      );
      
      const unsubscribe = onSnapshot(
        queryMessages,
        (snapshot) => {
          let msgs = [];
          snapshot.forEach((doc) => {
            msgs.push({ ...doc.data(), id: doc.id });
          });
          setMessages(msgs);
          setError("");
        },
        (err) => {
          console.error("Error fetching messages:", err);
          setError("Could not load messages. Please try again.");
          
          // Fallback: try query without orderBy
          if (err.code === "failed-precondition") {
            const fallbackQuery = query(
              messagesRef,
              where("room", "==", room)
            );
            const fallbackUnsubscribe = onSnapshot(fallbackQuery, (snapshot) => {
              let msgs = [];
              snapshot.forEach((doc) => {
                msgs.push({ ...doc.data(), id: doc.id });
              });
              // Sort by timestamp if available
              msgs.sort((a, b) => {
                const timeA = a.createdAt?.toDate?.() || new Date(0);
                const timeB = b.createdAt?.toDate?.() || new Date(0);
                return timeA - timeB;
              });
              setMessages(msgs);
              setError("");
            });
            return () => fallbackUnsubscribe();
          }
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Query setup error:", err);
      setError("Error setting up message listener");
    }
  }, [room, messagesRef]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage.trim() === "") return;
    
    if (!auth.currentUser) {
      setError("Not authenticated");
      return;
    }

    try {
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        room,
      });
      setNewMessage("");
      setError("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message: " + error.message);
    }
  };

  return (
    <div className="chat-app">
      <div className="header">
        <button className="back-btn" onClick={onBack}>← Back to Rooms</button>
        <h1>#{room.toUpperCase()}</h1>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="message">
              <div className="message-header">
                <span className="user">{message.user}</span>
                <span className="timestamp">
                  {message.createdAt ? new Date(message.createdAt.toDate()).toLocaleTimeString() : ""}
                </span>
              </div>
              <div className="message-text">{message.text}</div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          className="new-message-input"
          placeholder="Type your message..."
          autoFocus
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};
