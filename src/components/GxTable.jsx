import React, { useState } from "react";
import { useExpenses } from "./ExpenseContext";
import EditExpenseModal from "./EditExpenseModal";

const GroupExpensesTable = () => {
  const { groupExpenses, deleteGroupExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState(null);

  if (groupExpenses.length === 0) {
    return (
      <p className="text-center text-gray-500">
        You haven't added any group expenses yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto my-4">
      <h2 className="text-lg font-semibold mb-2">Group Expenses</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="w-full bg-gray-100">
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Value</th>
            <th className="py-2 px-4 border-b">Group</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {groupExpenses.map((expense) => (
            <tr key={expense.id} className="text-center">
              <td className="py-2 px-4 border-b">
                {expense.date.toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">{expense.title}</td>
              <td className="py-2 px-4 border-b">{expense.desc}</td>
              <td className="py-2 px-4 border-b">{expense.value}</td>
              <td className="py-2 px-4 border-b">{expense.group}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => setEditingExpense(expense)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteGroupExpense(expense.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editingExpense && (
        <EditExpenseModal
          isOpen={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          expense={editingExpense}
        />
      )}
    </div>
  );
};

export default GroupExpensesTable;
