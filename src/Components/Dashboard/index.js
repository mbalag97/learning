import React, { useState } from "react";
import {useAuth} from "../Context";

const Dashboard = () => {
  const [error, setError] = useState("");
  const {currentUser} = useAuth();
  const handleLogout = (e) => {};
  return (
    <div>
      <h1>Profile</h1>
      {error && <div>{error}</div>}
      <strong>Email : </strong>{currentUser.email}
      <p>updated profile</p>
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default Dashboard;
