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
  const [username, setUsername] = useState(["", ""]);

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

const addPersonalExpense = useCallback((expense) => {
  const expenseWithTimestamp = {
    ...expense,
    timestamp: new Date().toISOString(),
  };
  setPersonalExpenses((prev) => [...prev, expenseWithTimestamp]);
}, []);

const addGroupExpense = useCallback((expense) => {
  const expenseWithTimestamp = {
    ...expense,
    timestamp: new Date().toISOString(),
  };
  setGroupExpenses((prev) => [...prev, expenseWithTimestamp]);
}, []);

  const updatePersonalExpense = useCallback((updatedExpense) => {
    setPersonalExpenses((prev) =>
      prev.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  }, []);

const updateGroupExpense = useCallback((newExpense) => {
  setGroupExpenses((prev) => {
    const index = prev.findIndex((expense) => expense.id === newExpense.id);
    if (index !== -1) {
      // Update existing expense
      return prev.map((expense) =>
        expense.id === newExpense.id ? newExpense : expense
      );
    } else {
      // Add new expense
      return [...prev, newExpense];
    }
  });

  // Recalculate balances
  setGroups((prevGroups) => {
    return prevGroups.map((group) => {
      if (group.name === newExpense.group) {
        const updatedBalances = { ...group.balances };

        newExpense.splitAmong.forEach((member) => {
          const memberShare =
            newExpense.splitMethod === "equal"
              ? newExpense.value / newExpense.splitAmong.length
              : newExpense.splitAmounts[member] || 0;

          if (member !== newExpense.payer) {
            updatedBalances[member] =
              (updatedBalances[member] || 0) - memberShare;
            updatedBalances[newExpense.payer] =
              (updatedBalances[newExpense.payer] || 0) + memberShare;
          }
        });

        return { ...group, balances: updatedBalances };
      }
      return group;
    });
  });
}, []);

  const deletePersonalExpense = useCallback((id) => {
    setPersonalExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  const deleteGroupExpense = useCallback((id) => {
    setGroupExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

const addMemberToGroup = useCallback((groupName, member) => {
  setGroups((prev) =>
    prev.map((group) =>
      group.name === groupName
        ? {
            ...group,
            members: [...group.members, member],
            timestamp: new Date().toISOString(),
          }
        : group
    )
  );
}, []);

  const contextValue = {
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
    userId,
  };

  return (
    <ExpenseContext.Provider value={contextValue}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
