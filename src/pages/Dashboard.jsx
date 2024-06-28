import React, { useMemo } from "react";
import Layout from "../components/Layout";
import { useExpenses } from "../components/ExpenseContext";

const Dashboard = () => {
  const { username, personalExpenses, groupExpenses } = useExpenses();

  const dashboardData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const totalPersonalExpense = personalExpenses.reduce(
      (sum, expense) => sum + expense.value,
      0
    );

    const highestExpenseThisMonth = personalExpenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      })
      .reduce((max, expense) => Math.max(max, expense.value), 0);

    const moneyBorrowed = personalExpenses
      .filter((expense) => expense.type === "borrowed")
      .reduce((sum, expense) => sum + expense.value, 0);

    const totalGroupExpense = groupExpenses.reduce(
      (sum, expense) => sum + expense.value,
      0
    );

    const youOweFromPeople = groupExpenses
      .filter((expense) => expense.paidBy !== username[0])
      .reduce(
        (sum, expense) => sum + expense.value / expense.splitAmong.length,
        0
      );

    const peopleOweYou = groupExpenses
      .filter((expense) => expense.paidBy === username[0])
      .reduce(
        (sum, expense) =>
          sum +
          (expense.value * (expense.splitAmong.length - 1)) /
            expense.splitAmong.length,
        0
      );

    return {
      totalPersonalExpense,
      highestExpenseThisMonth,
      moneyBorrowed,
      totalGroupExpense,
      youOweFromPeople,
      peopleOweYou,
    };
  }, [personalExpenses, groupExpenses, username]);

  return (
    <Layout title="Dashboard" firstname={username[0]}>
      <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">
         Statitics
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Personal Expenses
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Personal Expense</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{dashboardData.totalPersonalExpense}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Highest Expense This Month
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  ₹{dashboardData.highestExpenseThisMonth}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Money You Borrowed</p>
                <p className="text-2xl font-bold text-red-600">
                  ₹{dashboardData.moneyBorrowed}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Group Expenses
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Group Expense</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{dashboardData.totalGroupExpense}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">You Owe From People</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{dashboardData.youOweFromPeople.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">People Owe You</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{dashboardData.peopleOweYou.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
