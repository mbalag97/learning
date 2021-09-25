import React, { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { auth } from "../../firebase-config";

const AuthContext = React.createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children, property }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [dispatchType, setDispatchType] = useState("");

  const signUp = (email, password) => {
    setDispatchType("SIGNUP");
    return auth.createUserWithEmailAndPassword(email, password);
  };

  const logIn = (email, password) => {
    setDispatchType("LOGIN");
    return auth.signInWithEmailAndPassword(email, password);
  };

  const logOut = () => {
    setDispatchType("LOGOUT");
    return auth.signOut();
  };

  const resetPass = () => {
    return auth.sendPasswordResetEmail();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      console.log("updating the current user sate", dispatchType);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  useEffect(() => {
    console.log("call dispatch here", dispatchType, currentUser);
    if (currentUser) {
      property.dispatch({
        type: dispatchType || "LOGIN",
        currentUser: currentUser,
      });
    } else {
      property.dispatch({
        type: dispatchType || "LOGOUT",
        currentUser: currentUser,
      });
    }
  }, [currentUser, dispatchType]);
  const value = {
    signUp,
    logIn,
    logOut,
    resetPass
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
