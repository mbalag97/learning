import { useEffect } from "react";
import React from "react";
import Pusher from "pusher-js";
import "./App.css";
import Chat from "./Components/Chat";
import SideBar from "./Components/SideBar";
import axios from "axios";

import { useState } from "react";
import Login from "./Components/Login";
import CreateChat from "./Components/CreateChat";
import AuthProvider from "./Components/Context";

import dotenv from "dotenv";
dotenv.config({ path: ".env" });

//New changes
// export const NewAuthContext = React.createContext();
const INITIAL_STATE = {
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SIGNUP":
      //set local storage
      const SIGNUP_STATE = {
        isAuthenticated: true,
        user: action.currentUser,
      };
      window.localStorage.setItem("state", JSON.stringify(SIGNUP_STATE));
      return {
        ...state,
        isAuthenticated: true,
        user: action.currentUser,
      };
    case "LOGIN":
      //set local storage
      const LOGIN_STATE = {
        isAuthenticated: true,
        user: action.currentUser,
      };
      window.localStorage.setItem("state", JSON.stringify(LOGIN_STATE));
      return {
        ...state,
        isAuthenticated: true,
        user: action.currentUser,
      };
    case "LOGOUT":
      //clear local storage
      const LOGOUT_STATE = {
        isAuthenticated: false,
        user: null,
      };
      window.localStorage.setItem("state", JSON.stringify(LOGOUT_STATE));
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      console.log(action.type + " is not a configured action");
      return state;
  }
};
function App() {
  console.log(
    "state from local storage",
    JSON.parse(window.localStorage.getItem("state"))
  );
  const [state, dispatch] = React.useReducer(
    reducer,
    JSON.parse(window.localStorage.getItem("state")) || INITIAL_STATE
  );
  const [clickedAddRooms, setClickedAddRooms] = useState(false);
  const [selectedChat, setSelectedChat] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const reqUrl =
      "http://192.168.1.10:8000/messages/sync?roomId=" + selectedChat._id;
    // console.log("room id in req url", selectedChat._id);
    axios.get(reqUrl).then((res) => {
      setMessages(res.data);
    });
  }, [selectedChat]);
  useEffect(() => {
    const pusher = new Pusher(
      process.env.REACT_APP_PUSHER_APP_KEY || "a9f3a7206fee4ae4ce5e",
      {
        cluster: process.env.REACT_APP_PUSHER_CLUSTER_NAME || "ap2",
      }
    );

    const channel = pusher.subscribe(
      process.env.REACT_APP_PUSHER_CHANNEL_NAME || "messages"
    );
    channel.bind(
      process.env.REACT_APP_PUSHER_EVENT_INSERTED || "inserted",
      (newMesages) => {
        setMessages([...messages, newMesages]);
      }
    );
    return () => {
      channel.unbind();
      channel.unsubscribe();
    };
  }, [messages]);
  return (
    <AuthProvider property={{ state, dispatch }}>
      {console.log("state in app", state)}
      <div className="app">
        {clickedAddRooms && (
          <CreateChat
            setClickedAddRooms={setClickedAddRooms}
            userDetails={state.user}
          />
        )}
        {!state.isAuthenticated ? (
          <Login />
        ) : (
          <div className="app_body">
            <SideBar
              setClickedAddRooms={setClickedAddRooms}
              setSelectedChat={setSelectedChat}
              userDetails={state.user}
            />
            <Chat
              selectedChat={selectedChat}
              messages={messages}
              userDetails={state.user}
            />
          </div>
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
