// firebaseUtils.js
import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export const createOrGetUser = async (firstName, lastName) => {
  let userId = localStorage.getItem("trackexUserId");

  if (!userId) {
    userId = uuidv4();
    localStorage.setItem("trackexUserId", userId);
  }

  const userRef = doc(db, "users", userId);

  // Create new user document
  await setDoc(userRef, {
    firstName,
    lastName,
    createdAt: new Date(),
  });

  return userId;
};

export const getUserData = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return null;
  }
};
