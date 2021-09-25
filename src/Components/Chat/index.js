import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, SearchOutlined } from "@material-ui/icons";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import MoreVert from "@material-ui/icons/MoreVert";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";

import "./chat.css";
export const Chat = (props) => {
  const [input, setInput] = useState("");
  const { messages, selectedChat, userDetails } = props;
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const handleOnClick = async (e) => {
    console.log("room id before sending the message", selectedChat._id)
    console.log("user id before sending the message", userDetails.uid)
    e.preventDefault();
    await axios.post("http://192.168.1.10:8000/messages/new", {
      message: input,
      name: userDetails.uid,
      timeStamp: new Date().toUTCString(),
      received: false,
      roomId: selectedChat._id
    });
    setInput("");
  };
  return (
    <div className="chat">
      {selectedChat === "" ? (
        <div>select a chat</div>
      ) : (
        <>
          {" "}
          <div className="chat_header">
            <Avatar />
            <div className="chat_headerInfo">
              <h3>{selectedChat.name}</h3>
              <p>Last seen at ...</p>
            </div>
            <div className="chat_headerRight">
              <IconButton>
                <SearchOutlined />
              </IconButton>
              <IconButton>
                <AttachFile />
              </IconButton>
              <IconButton>
                <MoreVert />
              </IconButton>
            </div>
          </div>
          <div className="chat_body">
            {messages.map((message, index) => {
              return (
                <p
                  key={index}
                  className={`chat_message ${
                    message.name === userDetails.uid && "chat_sender"
                  }`}
                >
                  <span className="chat_name">{message.name}</span>
                  {message.message}
                  <span className="chat_timestamp">{message.timeStamp}</span>
                </p>
              );
            })}
          </div>
          <div className="chat_footer">
            <IconButton>
              <InsertEmoticonIcon />
            </IconButton>

            <form>
              <input
                type="text"
                placeholder="Type a message"
                value={input}
                onChange={handleInputChange}
              />
              <button onClick={handleOnClick} type="submit" />
            </form>
            <IconButton>
              <MicIcon />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
};
export default Chat;
