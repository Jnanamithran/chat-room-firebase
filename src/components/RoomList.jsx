import { useState, useEffect } from "react";
import { db } from "../firebase-config.jsx";
import { collection, query, where, onSnapshot, getDocs, distinct } from "firebase/firestore";
import "../styles/RoomList.css";

export const RoomList = ({ onSelectRoom, onCreateRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const messagesRef = collection(db, "messages");
        const snapshot = await getDocs(messagesRef);
        
        const uniqueRooms = new Set();
        snapshot.forEach((doc) => {
          if (doc.data().room) {
            uniqueRooms.add(doc.data().room);
          }
        });
        
        setRooms(Array.from(uniqueRooms).sort());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    };

    fetchRooms();

    // Real-time listener for new messages in any room
    const messagesRef = collection(db, "messages");
    const unsubscribe = onSnapshot(messagesRef, () => {
      fetchRooms();
    });

    return () => unsubscribe();
  }, []);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoom.trim()) {
      onCreateRoom(newRoom.trim());
      setNewRoom("");
      setShowForm(false);
    }
  };

  return (
    <div className="room-list">
      <div className="room-list-header">
        <h2>Chat Rooms</h2>
        <button className="create-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕" : "+ New"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateRoom} className="create-room-form">
          <input
            type="text"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="Room name..."
            maxLength="30"
            autoFocus
          />
          <button type="submit">Create</button>
        </form>
      )}

      <div className="rooms-container">
        {loading ? (
          <div className="loading">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="no-rooms">
            <p>No rooms yet.</p>
            <p className="hint">Create one to get started!</p>
          </div>
        ) : (
          rooms.map((room) => (
            <button
              key={room}
              className="room-item"
              onClick={() => onSelectRoom(room)}
            >
              <span className="room-icon">#</span>
              <span className="room-name">{room}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
