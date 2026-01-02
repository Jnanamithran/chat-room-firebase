import { useState, useEffect } from "react";
import { db } from "../firebase-config.jsx";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import "../styles/RoomList.css";

export const RoomList = ({ onSelectRoom, onCreateRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

    // Real-time listener for new messages in any room - optimized with debounce
    const messagesRef = collection(db, "messages");
    let timeoutId;
    const unsubscribe = onSnapshot(messagesRef, () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(fetchRooms, 1000);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoom.trim()) {
      onCreateRoom(newRoom.trim());
      setNewRoom("");
      setShowForm(false);
      setSearchTerm("");
    }
  };

  const filteredRooms = rooms.filter((room) =>
    room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="room-list">
      <div className="room-list-header">
        <div className="header-content">
          <h2>💬 Chat Rooms</h2>
          <p className="room-count">{rooms.length} rooms</p>
        </div>
        <button className="create-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ New Room"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateRoom} className="create-room-form">
          <input
            type="text"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="Enter room name..."
            maxLength="30"
            autoFocus
            required
          />
          <button type="submit">Create</button>
        </form>
      )}

      {rooms.length > 0 && !showForm && (
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search rooms..."
            className="search-input"
          />
        </div>
      )}

      <div className="rooms-container">
        {loading ? (
          <div className="loading">
            <div className="loader-spinner"></div>
            <p>Loading chat rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="no-rooms">
            <div className="no-rooms-icon">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop"
                alt="Start chatting"
                loading="lazy"
              />
            </div>
            <h3>No rooms yet</h3>
            <p>Create your first room to start chatting!</p>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="no-results">
            <p>No rooms match &#34;{searchTerm}&#34;</p>
          </div>
        ) : (
          <div className="rooms-grid">
            {filteredRooms.map((room, index) => (
              <button
                key={room}
                className="room-item"
                onClick={() => onSelectRoom(room)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="room-badge">{filteredRooms.indexOf(room) + 1}</div>
                <span className="room-icon">#</span>
                <span className="room-name">{room}</span>
                <span className="room-arrow">→</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
