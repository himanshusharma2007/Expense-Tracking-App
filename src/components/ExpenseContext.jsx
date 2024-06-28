import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [personalExpenses, setPersonalExpenses] = useState([]);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(["",""]);
  useEffect(() => {
    const storedUserId = localStorage.getItem("trackexUserId");
    if (storedUserId) {
      console.log("id is get from the localStorage", storedUserId);
      setUserId(storedUserId);
    }
  }, []);

  const loadUserData = useCallback(async () => {
    if (userId) {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setPersonalExpenses(userData.personalExpenses || []);
        setGroupExpenses(userData.groupExpenses || []);
        setGroups(userData.groups || []);
        setUsername([userData.firstName, userData.lastName || ""]);

        console.log('userData.firstName :>> ', userData.firstName);
        console.log('username :>> ', username);
    
        console.log("data is set from Firestore");
      }
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    const updateFirestore = async () => {
      if (userId && !isLoading) {
        const userDocRef = doc(db, "users", userId);
        await setDoc(
          userDocRef,
          {
            personalExpenses,
            groupExpenses,
            groups,
          },
          { merge: true }
        );
        console.log("Data updated in Firestore");
      }
    };

    updateFirestore();
  }, [userId, personalExpenses, groupExpenses, groups, isLoading]);

  // ... rest of your existing context code ...

  const addPersonalExpense = useCallback((expense) => {
    setPersonalExpenses((prev) => [...prev, expense]);
  }, []);

  const addGroupExpense = useCallback((expense) => {
    setGroupExpenses((prev) => [...prev, expense]);
  }, []);

  const updatePersonalExpense = (updatedExpense) => {
    setPersonalExpenses(
      personalExpenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const updateGroupExpense = (updatedExpense) => {
    setGroupExpenses(
      groupExpenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };

  const deletePersonalExpense = (id) => {
    setPersonalExpenses(
      personalExpenses.filter((expense) => expense.id !== id)
    );
  };

  const deleteGroupExpense = (id) => {
    setGroupExpenses(groupExpenses.filter((expense) => expense.id !== id));
  };

  const addMemberToGroup = (groupName, member) => {
    setGroups(
      groups.map((group) =>
        group.name === groupName
          ? { ...group, members: [...group.members, member] }
          : group
      )
    );
  };

  return (
    <ExpenseContext.Provider
      value={{
        personalExpenses,
        groupExpenses,
        groups,
        username,
        setGroups,
        addPersonalExpense,
        addGroupExpense,
        updatePersonalExpense,
        updateGroupExpense,
        deletePersonalExpense,
        deleteGroupExpense,
        addMemberToGroup,
        userId, // Add userId to the context value
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
