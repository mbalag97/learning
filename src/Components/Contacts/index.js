import { Avatar } from "@material-ui/core";
import React from "react";
import "./contacts.css";

export const Contacts = (props) => {
  const {room, setSelectedChat} = props;
  const handleRoomSelect = e => {
    console.log("selected the chat rooms");
    console.log(room);
    setSelectedChat(room);
  }
  return (
    <div className="sidebarContacts" onClick={handleRoomSelect}>
      <Avatar />
      <div className="sidebarContacts_Info">
        <h2>{room.name}</h2>
        <p>This is the last message</p>
      </div>
    </div>
  );
};

export default Contacts;
