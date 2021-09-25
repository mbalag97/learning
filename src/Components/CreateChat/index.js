import { ReportOutlined } from "@material-ui/icons";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import "./CreateChat.css";

export const CreateChat = (props) => {
  const [userList, setUserList] = useState(null);
  const [roomName, setRoomName] = useState("");
  const handleAddRoomClick = (e) => {
    props.setClickedAddRooms((prev) => !prev);
  };
  const handleRoomNameChange = (e) => {
    console.log(e.target.value)
    setRoomName(e.target.value);
  };
  const handleAddRoomSubmitClick = async (e) => {
    const filteredUserList = userList.filter(user => user.email === roomName)
    console.log(filteredUserList)
    e.preventDefault();
    axios.post("http://192.168.1.10:8000/rooms/new", {
      name: roomName,
      users: [props.userDetails.uid, filteredUserList[0].uid],
    });
    setRoomName("");
    props.setClickedAddRooms(false);
  };
  useEffect(() => {
    console.log("opened new chat page");
    axios.get("http://192.168.1.10:8000/users/sync").then((res) => {
      console.log(JSON.stringify(res));
      setUserList(res.data.users);
    });
  }, []);
  console.log("new chat user list", userList);
  return (
    <div className="addRoom_Container">
      <div className="addRoom_createChat">
        <span onClick={handleAddRoomClick}>X</span>
        <h3>New Chat</h3>

        <div className="addRoom_searchArea">
          <datalist id="suggestions" placeholder="Search for chat">
            {userList && userList.map((user, index) => {
              console.log(user.email);
              return <option key={index}>{user.email}</option>;
            })}
          </datalist>
          <input value={roomName} onChange={handleRoomNameChange} autoComplete="on" list="suggestions" />
          <button onClick={handleAddRoomSubmitClick}>Start Chat</button>
        </div>
      </div>
    </div>
  );
};

export default CreateChat;
