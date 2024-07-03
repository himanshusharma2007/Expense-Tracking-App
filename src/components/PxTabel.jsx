import React, { useState } from "react";
import { useExpenses } from "./ExpenseContext";
import EditExpenseModal from "../Modals/EditExpenseModal";
import ExpenseDetailsModal from "../Modals/ExpenseDetailsModal"; // New component
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import formatTimestamp from '../utils/dateFormatters'

const PersonalExpensesTable = ({ pheading }) => {
  const { personalExpenses, deletePersonalExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const sortPersonalExpense = [
    ...personalExpenses.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    ),
  ];

  if (personalExpenses.length === 0) {
    return (
      <p className="text-center text-gray-500">
        You haven't added any personal expenses yet.
      </p>
    );
  }
  return (
    <div className="overflow-x-auto my-4 mx-2 ">
      {pheading && (
        <h2 className="text-lg font-semibold mb-2">Personal Expenses</h2>
      )}
      <table className="min-w-full bg-white border border-gray-200 hidden md:table">
        <thead>
          <tr className="w-full bg-gray-100">
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortPersonalExpense.map((expense) => (
            <tr key={expense.id} className="text-center">
              <td className="py-2 px-4 border-b">
                {formatTimestamp(expense.timestamp, true)}
              </td>
              <td className="py-2 px-4 border-b">{expense.title}</td>
              <td className="py-2 px-4 border-b">{expense.desc}</td>
              <td className="py-2 px-4 border-b">₹{expense.value}</td>
              <td className="py-2 px-4 border-b flex items-center justify-center space-x-3">
                <button onClick={() => setEditingExpense(expense)}>
                  <FaEdit fontSize="25px" />
                </button>
                <button onClick={() => deletePersonalExpense(expense.id)}>
                  <FaTrashCan className="text-red-500" fontSize="25px" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Small screen layout */}
      <div className="md:hidden mx-2 sm:mx-4">
        {sortPersonalExpense.map((expense) => (
          <div
            key={expense.id}
            className="bg-white border border-gray-200 rounded-lg mb-2 p-3"
            onClick={() => setSelectedExpense(expense)}
          >
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {formatTimestamp(expense.timestamp, true)}
              </div>

              <div className="font-semibold">₹{expense.value}</div>
            </div>
            <div className="flex  justify-between items-center">
              <div className="mt-1 font-medium">{expense.title}</div>
              <div className="font-thin">{expense.expenseCategory}</div>
            </div>
          </div>
        ))}
      </div>

      {editingExpense && (
        <EditExpenseModal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          expense={editingExpense}
        />
      )}

      {selectedExpense && (
        <ExpenseDetailsModal
          isOpen={!!selectedExpense}
          onClose={() => setSelectedExpense(null)}
          expense={selectedExpense}
          onEdit={() => setEditingExpense(selectedExpense)}
          onDelete={() => {
            deletePersonalExpense(selectedExpense.id);
            setSelectedExpense(null);
          }}
        />
      )}
    </div>
  );
};

export default PersonalExpensesTable;
