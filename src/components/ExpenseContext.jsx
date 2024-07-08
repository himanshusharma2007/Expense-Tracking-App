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
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [groups, setGroups] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState(["", ""]);

  useEffect(() => {
    const fatchUserData = async () => {
      const storedUserId = localStorage.getItem("trackexUserId");
      if (storedUserId) {
        console.log("id is get from the localStorage", storedUserId);
        const userDocRef = doc(db, "users", storedUserId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();

          console.log("userData.firstName", userData.firstName);
          setUsername([userData.firstName, userData.lastName || ""]);
          setUserId(storedUserId);
        }
      }
    };
    fatchUserData();
  }, []);

const loadUserData = useCallback(async () => {
  if (userId) {
    setIsLoading(true);
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setMonthlyBudget(userData.monthlyBudget || 0);
      setPersonalExpenses(userData.personalExpenses || []);
      setGroupExpenses(userData.groupExpenses || []);
      setGroups(
        (userData.groups || []).map((group) => ({
          ...group,
          memberBalances: group.memberBalances || {},
        }))
      );
      setUsername([userData.firstName || "", userData.lastName || ""]);
    } else {
      // Handle case where user document doesn't exist
      console.log("User document does not exist. Creating new document.");
      await setDoc(userDocRef, {
        monthlyBudget: 0,
        personalExpenses: [],
        groupExpenses: [],
        groups: [],
        firstName: "",
        lastName: "",
      });
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
      try {
        await setDoc(
          userDocRef,
          {
            monthlyBudget,
            personalExpenses,
            groupExpenses,
            groups,
          },
          { merge: true }
        );
        console.log("Data updated in Firestore");
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    }
  };

  if (!isLoading) {
    updateFirestore();
  }
}, [userId, personalExpenses, groupExpenses, groups, isLoading, monthlyBudget]);

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
    if (expense.splitMethod == "equal") {
      setGroups((prevGroups) => {
        return prevGroups.map((group) => {
          if (group.name === expense.group) {
            const updatedMemberBalances = calculateMemberBalances(
              group,
              expenseWithTimestamp
            );
            return { ...group, memberBalances: updatedMemberBalances };
          }
          return group;
        });
      });
    }
  }, []);

  const calculateMemberBalances = (group, newExpense) => {
    let memberBalances = JSON.parse(JSON.stringify(group.memberBalances || {}));
    const members = group.members || [];
    const { splitMethod, value, payer } = newExpense;

    if (splitMethod === "equal" && payer !== "everyone") {
      const share = value / members.length;
      members.forEach((member) => {
        if (member !== payer) {
          if (!memberBalances[member]) memberBalances[member] = {};
          if (!memberBalances[payer]) memberBalances[payer] = {};

          memberBalances[member][payer] =
            (memberBalances[member][payer] || 0) + share;
          memberBalances[payer][member] =
            (memberBalances[payer][member] || 0) - share;
        }
      });
    }

    return memberBalances;
  };

  const updatePersonalExpense = useCallback((updatedExpense) => {
    setPersonalExpenses((prev) =>
      prev.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  }, []);

  const updateGroupExpense = useCallback((updatedExpense) => {
    setGroupExpenses((prev) =>
      prev.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );

    // Recalculate memberBalances
    setGroups((prevGroups) => {
      return prevGroups.map((group) => {
        if (group.name === updatedExpense.group) {
          const updatedMemberBalances = calculateMemberBalances(
            group,
            updatedExpense
          );
          return { ...group, memberBalances: updatedMemberBalances };
        }
        return group;
      });
    });
  }, []);

  const deleteGroupExpense = useCallback((id) => {
    setGroupExpenses((prev) => {
      const expenseToDelete = prev.find((expense) => expense.id === id);
      if (expenseToDelete) {
        setGroups((prevGroups) => {
          return prevGroups.map((group) => {
            if (group.name === expenseToDelete.group) {
              const updatedMemberBalances = calculateMemberBalances(group, {
                ...expenseToDelete,
                value: -expenseToDelete.value, // Negate the value to reverse the expense
              });
              return { ...group, memberBalances: updatedMemberBalances };
            }
            return group;
          });
        });
      }
      return prev.filter((expense) => expense.id !== id);
    });
  }, []);

  const deletePersonalExpense = useCallback((id) => {
    setPersonalExpenses((prev) => prev.filter((expense) => expense.id !== id));
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
    monthlyBudget,
    setMonthlyBudget,
    personalExpenses,
    groupExpenses,
    groups,
    username,
    setGroups,
    addPersonalExpense,
    setGroupExpenses,
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
