import React, { useState} from "react";
import { useExpenses } from "./ExpenseContext";
import { FaWallet, FaMoneyBillWave, FaReceipt } from "react-icons/fa";
import { format } from "date-fns";

const BudgetTracker = () => {
  const { monthlyBudget, setMonthlyBudget } = useExpenses();
  const { personalExpenses, groupExpenses } = useExpenses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  
  const currentMonth = format(new Date(), "MMMM yyyy");

  const totalExpensesThisMonth = personalExpenses
    .concat(groupExpenses)
    .filter((expense) => {
      const expenseDate = new Date(expense.timestamp);
      return format(expenseDate, "MMMM yyyy") === currentMonth;
    })
    .reduce((sum, expense) => sum + expense.value, 0);

  const remainingBudget = monthlyBudget - totalExpensesThisMonth;

  const expenseCount = personalExpenses
    .concat(groupExpenses)
    .filter((expense) => {
      const expenseDate = new Date(expense.timestamp);
      return format(expenseDate, "MMMM yyyy") === currentMonth;
    }).length;

  const handleSetBudget = () => {
    const newBudget = parseFloat(budgetInput);
    if (!isNaN(newBudget) && newBudget >= 0) {
      setMonthlyBudget(newBudget);
      localStorage.setItem("monthlyBudget", newBudget.toString());
      setIsModalOpen(false);
    }
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow mx-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:place-items-center">
        <div className="flex items-center space-x-2">
          <FaWallet className="text-blue-500 text-2xl" />
          <div>
            <p className="text-sm text-gray-600">Monthly Budget</p>
            <p className="text-xl font-bold text-blue-600">
              ₹{monthlyBudget.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <FaMoneyBillWave className="text-green-500 text-2xl" />
          <div>
            <p className="text-sm text-gray-600">
              {remainingBudget >= 0 ? "Remaining" : "Out of Budget"}
            </p>
            <p
              className={`text-xl font-bold ${
                remainingBudget >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{Math.abs(remainingBudget).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <FaReceipt className="text-purple-500 text-2xl" />
          <div>
            <p className="text-sm text-gray-600">Expenses This Month</p>
            <p className="text-xl font-bold text-purple-600">{expenseCount}</p>
          </div>
        </div>

        <div className="flex items-center justify-center sm:justify-start">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            Set Budget
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Set Monthly Budget</h3>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter budget amount"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSetBudget}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Set Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTracker;
