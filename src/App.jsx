import { useState } from "react";
import { Chat } from "./components/Chat";
import { Auth } from "./components/Auth";
import { AppWrapper } from "./components/AppWrapper";
import { RoomList } from "./components/RoomList";
import Cookies from "universal-cookie";
import "./App.css";

const cookies = new Cookies();

function ChatApp() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [selectedRoom, setSelectedRoom] = useState(null);

  if (!isAuth) {
    return (
      <AppWrapper
        isAuth={isAuth}
        setIsAuth={setIsAuth}
      >
        <Auth setIsAuth={setIsAuth} />
      </AppWrapper>
    );
  }

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
  };

  const handleCreateRoom = (roomName) => {
    setSelectedRoom(roomName);
  };

  const handleBackToRooms = () => {
    setSelectedRoom(null);
  };

  return (
    <AppWrapper isAuth={isAuth} setIsAuth={setIsAuth}>
      {!selectedRoom ? (
        <RoomList 
          onSelectRoom={handleSelectRoom}
          onCreateRoom={handleCreateRoom}
        />
      ) : (
        <Chat 
          room={selectedRoom}
          onBack={handleBackToRooms}
        />
      )}
    </AppWrapper>
  );
}

export default ChatApp;
