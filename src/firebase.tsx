import firebase from "firebase";

export const firebaseConfig = {
   apiKey: "AIzaSyB4oV9gDAxNJ2IfPhMOB1JESFqxXgTo-CY",
   authDomain: "homelesstracker-23e89.firebaseapp.com",
   projectId: "homelesstracker-23e89",
   storageBucket: "homelesstracker-23e89.appspot.com",
   messagingSenderId: "1029301387079",
   appId: "1:1029301387079:web:d0887763b73505e8ced662",
};

// Connect front end to back end
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Get access to database
const db = firebaseApp.firestore();

export default db;
