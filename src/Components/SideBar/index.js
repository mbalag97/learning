import React, { useEffect } from "react";
import "./sidebar.css";

//Material UI Icons
import ChatIcon from "@material-ui/icons/Chat";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Avatar, IconButton } from "@material-ui/core";
import { InsertDriveFileSharp, SearchOutlined } from "@material-ui/icons";
import Contacts from "../Contacts";
import { useState } from "react";
import axios from "axios";
import Pusher from "pusher-js";
import { useAuth } from "../Context";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";
const SideBar = (props) => {
  const { logOut } = useAuth();
  const { setSelectedChat } = props;
  const [rooms, setRooms] = useState([]);
  const [sideBarState, setSidebarState] = useState("LIST_ROOMS");
  const [openMoreOption, setOpenMoreOption] = useState(false);
  useEffect(() => {
    const roomSyncUrl =
      "http://192.168.1.10:8000/rooms/sync?users=" + props.userDetails.uid;
    console.log("chat room sync url : ", roomSyncUrl);
    axios.get(roomSyncUrl).then((res) => {
      setRooms(res.data);
    });
  }, [props.userDetails.uid]);
  useEffect(() => {
    const pusher = new Pusher(
      process.env.REACT_APP_PUSHER_APP_KEY || "a9f3a7206fee4ae4ce5e",
      {
        cluster: process.env.REACT_APP_PUSHER_CLUSTER_NAME || "ap2",
      }
    );

    const channel = pusher.subscribe(
      process.env.REACT_APP_PUSHER_CHANNEL_NAME || "rooms"
    );
    channel.bind(
      process.env.REACT_APP_PUSHER_EVENT_INSERTED || "inserted",
      (newRoom) => {
        if (newRoom.users.find((user) => user === props.userDetails.uid)) {
          setRooms([...rooms, newRoom]);
        }
      }
    );
    return () => {
      channel.unbind();
      channel.unsubscribe();
    };
  }, [rooms]);
  const handleLogoutClick = async (e) => {
    setOpenMoreOption((prev) => !prev);
    try {
      await logOut();
    } catch {
      alert("unable to logout");
    }
  };
  const handleAddRoomClick = (e) => {
    props.setClickedAddRooms((prev) => !prev);
  };
  const handleMoreClick = (e) => {
    setOpenMoreOption((prev) => !prev);
  };
  const handleProfileClick = (e) => {
    setOpenMoreOption(false);
    setSidebarState("PROFILE_VIEW");
  };
  const handleProfileBackClick = (e) => {
    setSidebarState("LIST_ROOMS");
  };
  return (
    <div className="sidebar">
      {sideBarState === "LIST_ROOMS" && (
        <>
          {" "}
          <div className="sidebar_header">
            <Avatar
              src={process.env.PUBLIC_URL + "/Images/profile-avatar.png"}
              onClick={handleProfileClick}
            />
            <div className="sidebar_headerRight">
              <IconButton>
                <DonutLargeIcon />
              </IconButton>
              <IconButton onClick={handleAddRoomClick}>
                <ChatIcon />
              </IconButton>
              <IconButton onClick={handleMoreClick}>
                <MoreVertIcon />
              </IconButton>
              {openMoreOption && (
                <div className="sidebar_MoreOptionsContainer">
                  <ul className="sidebar_moreOptions">
                    <li onClick={handleLogoutClick}>Logout</li>
                    <li onClick={handleProfileClick}>Profile</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="sidebar_search">
            <div className="sidebar_searchContainer">
              <SearchOutlined />
              <input placeholder="Search or start new chat" type="text" />
            </div>
          </div>
          <div className="sidebar_contacts">
            {rooms.map((room, index) => {
              return (
                <Contacts
                  room={room}
                  key={index}
                  setSelectedChat={setSelectedChat}
                />
              );
            })}
          </div>
        </>
      )}
      {sideBarState === "PROFILE_VIEW" && (
        <>
          {" "}
          <div className="sidebar_profileHeader">
            <IconButton onClick={handleProfileBackClick}>
              <ArrowBackIcon />
            </IconButton>
            <p>Profile</p>
          </div>
          <div className="sidebar_profileArea">
            <Avatar
              src={process.env.PUBLIC_URL + "/Images/profile-avatar.png"}
              onClick={handleProfileClick}
            />
            <div className="sidenbar_profileView">
              <div className="sidebar_profileFieldBox">
                <label htmlFor="name">Your Email</label>
                <div className="sidenbar_profileFields">
                  <input
                    type="email"
                    defaultValue={props.userDetails.email}
                    disabled
                  />
                  <IconButton onClick={() => alert("Email is not editable")}>
                    <EditIcon />
                  </IconButton>
                </div>
              </div>
              <div className="sidebar_profileFieldBox">
                <label htmlFor="name">Your Password</label>
                <div className="sidenbar_profileFields">
                  <input
                    type="password"
                    defaultValue={props.userDetails.email}
                    placeholder="Leave blank to keep the same"
                  />
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </div>
              </div>
              <div className="sidebar_profileFieldBox">
                <label htmlFor="name">Your Name</label>
                <div className="sidenbar_profileFields">
                  <input type="text" />
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
