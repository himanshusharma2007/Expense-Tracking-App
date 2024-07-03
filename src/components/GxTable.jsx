import React, { useState } from "react";
import { useExpenses } from "./ExpenseContext";
import EditExpenseModal from "../Modals/EditExpenseModal";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import formatTimestamp from '../utils/dateFormatters'
const GroupExpensesTable = ({ gheading }) => {
  const { groupExpenses, deleteGroupExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState(null);
 const sortGroupExpenses = [
   ...groupExpenses.sort(
     (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
   ),
 ];
 

  if (groupExpenses.length === 0) {
    return (
      <p className="text-center text-gray-500">
        You haven't added any group expenses yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto my-4">
      {gheading && (
        <h2 className="text-lg font-semibold mb-2">Group Expenses</h2>
      )}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="w-full bg-gray-100">
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Group</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {groupExpenses.map((expense) => (
            <tr key={expense.id} className="text-center">
              <td className="py-2 px-4 border-b">
                {formatTimestamp(expense.timestamp , true)}
              </td>

              <td className="py-2 px-4 border-b">{expense.title}</td>
              <td className="py-2 px-4 border-b">{expense.desc}</td>
              <td className="py-2 px-4 border-b">₹{expense.value}</td>
              <td className="py-2 px-4 border-b">{expense.group}</td>
              <td className="py-2 px-4 border-b flex items-center justify-center space-x-3">
                <button onClick={() => setEditingExpense(expense)}>
                  <FaEdit fontSize="25px" />
                </button>
                <button onClick={() => deleteGroupExpense(expense.id)}>
                  <FaTrashCan className="text-red-500" fontSize="25px" />
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
