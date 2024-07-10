import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { useExpenses } from "../components/ExpenseContext";
import { format, isValid } from "date-fns";
import { useNavigate } from "react-router-dom";
import { IoAnalytics } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import formatTimestamp from "../utils/dateFormatters";
import ExpenseTable from "../components/ExpenseTable";
import BudgetTracker from "../components/BudgetTracker";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
const Dashboard = () => {
  const navigate = useNavigate();
  const {
    username,
    personalExpenses,
    groupExpenses,
    groups,
    setUserId,
    setUsername,
  } = useExpenses();
  const [modalContent, setModalContent] = useState(null);
 const storedUserId = localStorage.getItem("trackexUserId");

   useEffect(() => {
     const fatchUserData = async () => {
       
       if (storedUserId) {
         console.log("id is get from the localStorage", storedUserId);
         const userDocRef = doc(db, "users", storedUserId);
         const userDoc = await getDoc(userDocRef);
         if (userDoc.exists()) {
           const userData = userDoc.data();

           setUsername([userData.firstName, userData.lastName || ""]);
           setUserId(storedUserId);
         }
       }
     };
     fatchUserData();
   }, [storedUserId]);

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4 py-6 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto animate-fade-in-up">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg md:text-xl font-medium text-gray-900">
                {title}
              </h3>
            </div>
          </div>
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
          <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Empty = () => {
    if (personalExpenses.length === 0 && groupExpenses.length === 0) {
      return (
        <p className="text-center text-gray-500">
          You haven't added any expenses yet.
        </p>
      );
    }
  };

  const dashboardData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const totalPersonalExpense = personalExpenses.reduce(
      (sum, expense) => sum + expense.value,
      0
    );

    const highestExpenseThisMonth = personalExpenses.reduce((max, expense) => {
      const expenseDate = new Date(expense.date);
      if (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      ) {
        return Math.max(max, expense.value);
      }
      return max;
    }, 0);

    // If no expenses this month, find the highest expense overall
    const highestExpenseOverall = personalExpenses.reduce(
      (max, expense) => (expense.value > max.value ? expense : max),
      { value: 0 }
    );

    const moneyBorrowed = personalExpenses
      .filter((expense) => expense.expenseCategory === "borrowed")
      .reduce((sum, expense) => sum + expense.value, 0);

    const totalGroupExpense = groupExpenses.reduce(
      (sum, expense) => sum + expense.value,
      0
    );
    let youOweFromPeople = 0;
    let peopleOweYou = 0;

    groups.forEach((group) => {
      if (group.memberBalances && group.memberBalances[username[0]]) {
        Object.entries(group.memberBalances[username[0]]).forEach(
          ([member, balance]) => {
            if (balance > 0) {
              youOweFromPeople += Math.abs(balance);           
            } else if (balance < 0) {
             peopleOweYou += Math.abs(balance);
            }
          }
        );
      }
    });

    // Get the last personal and group expenses
    const lastPersonalExpense =
      personalExpenses[personalExpenses.length - 1] || null;
    const lastGroupExpense = groupExpenses[groupExpenses.length - 1] || null;

    return {
      totalPersonalExpense,

      highestExpenseThisMonth:
        highestExpenseThisMonth || highestExpenseOverall.value,
      highestExpenseOverall,

      moneyBorrowed,
      totalGroupExpense,
      youOweFromPeople,
      peopleOweYou,
      lastPersonalExpense,
      lastGroupExpense,
    };
  }, [personalExpenses, groupExpenses, username, groups]);

  const openModal = (content) => {
    setModalContent(content);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const renderModalContent = () => {
    if (!modalContent) return null;

    switch (modalContent.type) {
      case "youOwe":
        return (
          <ul>
            {groups.flatMap((group) =>
              group.memberBalances && group.memberBalances[username[0]]
                ? Object.entries(group.memberBalances[username[0]])
                    .filter(([member, balance]) => balance > 0)
                    .map(([member, balance], index) => (
                      <li
                        key={`${group.name}-${index}`}
                        className="mb-2 text-sm md:text-base"
                      >
                        You owe {member} ₹{Math.abs(balance).toFixed(2)} in
                        group "{group.name}"
                      </li>
                    ))
                : []
            )}
          </ul>
        );
      case "peopleOweYou":
        return (
          <ul>
            {groups.flatMap((group) =>
              group.memberBalances && group.memberBalances[username[0]]
                ? Object.entries(group.memberBalances[username[0]])
                    .filter(([member, balance]) => balance < 0)
                    .map(([member, balance], index) => (
                      <li
                        key={`${group.name}-${index}`}
                        className="mb-2 text-sm md:text-base"
                      >
                        {member} owes you ₹{Math.abs(balance.toFixed(2))} in group "
                        {group.name}"
                      </li>
                    ))
                : []
            )}
          </ul>
        );
      case "moneyBorrowed":
        return (
          <ul>
            {personalExpenses
              .filter((expense) => expense.expenseCategory === "borrowed")
              .map((expense, index) => {
                let formattedDate = "Invalid Date";
                try {
                  const expenseDate = new Date(expense.date);
                  if (isValid(expenseDate)) {
                    formattedDate = format(expenseDate, "MMM dd, yyyy");
                  }
                } catch (error) {
                  console.error("Error formatting date:", error);
                }

                return (
                  <li key={index} className="mb-2 text-sm md:text-base">
                    You borrowed ₹{expense.value.toFixed(2)} for "
                    {expense.title}"
                    {formattedDate !== "Invalid Date"
                      ? ` on ${formattedDate}`
                      : ""}
                  </li>
                );
              })}
          </ul>
        );
      case "highestExpense":
        const highestExpense = dashboardData.highestExpenseOverall;

        return (
          <div className="text-sm md:text-base">
            <p>Highest expense: {highestExpense.title}</p>
            <p>Amount: ₹{highestExpense.value.toFixed(2)}</p>
            <p>Date: {formatTimestamp(highestExpense.timestamp, true)}</p>
            <p>Category: {highestExpense.expenseCategory}</p>
          </div>
        );
    }
  };

  return (
    <Layout title="Dashboard">
      <BudgetTracker />
      <div className="px-3 md:p-6 bg-gray-100 rounded-lg md:shadow-lg">
        <h1 className="flex items-center space-x-3 text-2xl md:text-3xl font-semibold mb-6 text-gray-800">
          <IoAnalytics className="text-[24px] md:text-[30px]" />
          <div>Statistics</div>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 align-middle">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
              Personal Expenses
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  Total Personal Expense
                </p>
                <p
                  className={`text-xl md:text-2xl font-bold text-green-600 ${
                    dashboardData.totalPersonalExpense > 0
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() =>
                    dashboardData.totalPersonalExpense > 0 &&
                    navigate("/personal-expenses")
                  }
                >
                  ₹{dashboardData.totalPersonalExpense}
                </p>
              </div>

              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  Money You Borrowed
                </p>
                <p
                  className={`text-xl md:text-2xl font-bold text-red-600 ${
                    dashboardData.moneyBorrowed > 0
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() =>
                    dashboardData.moneyBorrowed > 0 &&
                    openModal({ type: "moneyBorrowed" })
                  }
                >
                  ₹{dashboardData.moneyBorrowed}
                </p>
              </div>

              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  Highest Expense This Month
                </p>
                <p
                  className={`text-xl md:text-2xl font-bold text-yellow-600 ${
                    dashboardData.highestExpenseThisMonth > 0
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() =>
                    dashboardData.highestExpenseThisMonth > 0 &&
                    openModal({ type: "highestExpense" })
                  }
                >
                  ₹{dashboardData.highestExpenseThisMonth.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-700">
              Group Expenses
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  Total Group Expense
                </p>
                <p
                  className={`text-xl md:text-2xl font-bold text-blue-600 ${
                    dashboardData.totalGroupExpense > 0
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() =>
                    dashboardData.totalGroupExpense > 0 &&
                    navigate("/group-expenses")
                  }
                >
                  ₹{dashboardData.totalGroupExpense}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  You Owe to People
                </p>
                <p
                  className={`text-xl md:text-2xl font-bold text-orange-600 ${
                    dashboardData.youOweFromPeople > 0
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() =>
                    dashboardData.youOweFromPeople > 0 &&
                    openModal({ type: "youOwe" })
                  }
                >
                  ₹
                  {typeof dashboardData.youOweFromPeople === "number"
                    ? dashboardData.youOweFromPeople.toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  People Owe You
                </p>
                <p
                  className={`text-xl md:text-2xl font-bold text-purple-600 ${
                    dashboardData.peopleOweYou > 0
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  onClick={() =>
                    dashboardData.peopleOweYou > 0 &&
                    openModal({ type: "peopleOweYou" })
                  }
                >
                  ₹{dashboardData.peopleOweYou.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 p-4 md:p-6 bg-gray-100 rounded-lg md:shadow-lg">
        <h2 className="flex space-x-3 text-2xl md:text-3xl items-center font-semibold mb-6 text-gray-800">
          <FaHistory className="text-[24px] md:text-[30px]" />
          <div>Latest Expenses</div>
        </h2>
        <h1>
          <Empty />
        </h1>
        <ExpenseTable
          title="Last Personal Expense"
          expense={dashboardData.lastPersonalExpense}
        />
        <ExpenseTable
          title="Last Group Expense"
          expense={dashboardData.lastGroupExpense}
          group
        />
      </div>
      <Modal
        isOpen={!!modalContent}
        onClose={closeModal}
        title={modalContent?.type}
      >
        {renderModalContent()}
      </Modal>
    </Layout>
  );
};

export default Dashboard;
