import firebase from "firebase/app";
import "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgJp2DXMeS5P4vGOcPXOqetNcfg-c_9ys",
  authDomain: "whatsapp-mern-21199.firebaseapp.com",
  projectId: "whatsapp-mern-21199",
  storageBucket: "whatsapp-mern-21199.appspot.com",
  messagingSenderId: "1066551285242",
  appId: "1:1066551285242:web:e9752f7bca08b305e6c043",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const auth = firebaseApp.auth();

export default firebaseApp;
