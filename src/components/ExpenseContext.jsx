import React, { createContext, useState, useContext } from "react";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
      const newExpense = {
        id:1233, // Generate a unique ID
        title: "ewe e",
        desc: "jhvkasdfisydf",
        value: 123,
        date: null,
        type: "personal",
        group:  null,
      };
      const group={
        name:"xyz",
        members:[],
      }
  const [personalExpenses, setPersonalExpenses] = useState([newExpense]);
  const [groupExpenses, setGroupExpenses] = useState([]);
  const [groups, setGroup] = useState([group]);

  const addPersonalExpense = (expense) => {
    setPersonalExpenses([...personalExpenses, expense]);
  };

  const addGroupExpense = (expense) => {
    setGroupExpenses([...groupExpenses, expense]);
  };

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

  return (
    <ExpenseContext.Provider
      value={{
        personalExpenses,
        groupExpenses,
        groups,
        setGroup,
        addPersonalExpense,
        addGroupExpense,
        updatePersonalExpense,
        updateGroupExpense,
        deletePersonalExpense,
        deleteGroupExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
