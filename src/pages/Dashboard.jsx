import React, { useMemo } from "react";
import Layout from "../components/Layout";
import { useExpenses } from "../components/ExpenseContext";
import { format, isValid } from "date-fns";

const Dashboard = () => {
  const { username, personalExpenses, groupExpenses } = useExpenses();
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
      .filter((expense) => expense.expenseCategory === "borrowed")
      .reduce((sum, expense) => sum + expense.value, 0);

    const totalGroupExpense = groupExpenses.reduce(
      (sum, expense) => sum + expense.value,
      0
    );

    const youOweFromPeople = groupExpenses.reduce((sum, expense) => {
      if (expense.payer !== username[0] && expense.payer !== "everyone") {
        const yourShare =
          expense.splitMethod === "equal"
            ? expense.value / expense.splitAmong.length
            : expense.splitAmounts[username[0]] || 0;
        return sum + yourShare;
      }
      return sum;
    }, 0);

    const peopleOweYou = groupExpenses.reduce((sum, expense) => {
      if (expense.payer === username[0]) {
        const othersShare =
          expense.splitMethod === "equal"
            ? (expense.value * (expense.splitAmong.length - 1)) /
              expense.splitAmong.length
            : Object.values(expense.splitAmounts).reduce(
                (total, amount) => total + amount,
                0
              ) - (expense.splitAmounts[username[0]] || 0);
        return sum + othersShare;
      }
      return sum;
    }, 0);

    // Get the last personal and group expenses
    const lastPersonalExpense =
      personalExpenses[personalExpenses.length - 1] || null;
    const lastGroupExpense = groupExpenses[groupExpenses.length - 1] || null;

    return {
      totalPersonalExpense,
      highestExpenseThisMonth,
      moneyBorrowed,
      totalGroupExpense,
      youOweFromPeople,
      peopleOweYou,
      lastPersonalExpense,
      lastGroupExpense,
    };
  }, [personalExpenses, groupExpenses, username]);

  const ExpenseTable = ({ title, expense, group }) => {
    if (!expense) return null;
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return isValid(date) ? format(date, "MMM dd, yyyy") : "Invalid Date";
    };
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {group ? "Group" : "Category"}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {expense.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{expense.value.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {expense.type === "personal"
                    ? expense.expenseCategory
                    : expense.group}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Layout title="Dashboard" firstname={username[0]}>
      <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Statitics</h1>

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
      <div className="mt-4 p-6 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Latest Expenses
        </h2>
        <p>
          <Empty />
        </p>
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
    </Layout>
  );
};

export default Dashboard;
