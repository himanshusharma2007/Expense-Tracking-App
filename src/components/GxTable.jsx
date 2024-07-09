import React, { useState } from "react";
import { useExpenses } from "./ExpenseContext";
import EditExpenseModal from "../Modals/EditExpenseModal";
import ExpenseDetailsModal from "../Modals/ExpenseDetailsModal";
import { FaTrashCan } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import formatTimestamp from "../utils/dateFormatters";



class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in GroupExpensesTable:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong with the expense table.</h1>;
    }

    return this.props.children;
  }
}

const GroupExpensesTable = ({ gheading, thisGroupExpenses }) => {
  const { groupExpenses, deleteGroupExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);

  let expenses = [];
  let sortGroupExpenses = [];

  try {
    expenses = thisGroupExpenses || groupExpenses || [];
    sortGroupExpenses = [...expenses].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  } catch (error) {
    console.error("Error processing expenses:", error);
  }

  if (!Array.isArray(sortGroupExpenses) || sortGroupExpenses.length === 0) {
    return (
      <p className="text-center text-gray-500">No group expenses available.</p>
    );
  }

  return (
    <div className="overflow-x-auto my-4 mx-2">
      {gheading && (
        <h2 className="text-lg font-semibold mb-2">Group Expenses</h2>
      )}

      {/* Large screen table */}
      <table className="min-w-full bg-white border border-gray-200 hidden md:table">
        <thead>
          <tr className="w-full bg-gray-100">
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Group</th>
            <th className="py-2 px-4 border-b">Split Method</th>
            <th className="py-2 px-4 border-b">Actions</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {sortGroupExpenses.map(
            (expense) =>
              expense && (
                <tr key={expense.id || Math.random()} className="text-center">
                  <td className="py-2 px-4 border-b">
                    {expense.timestamp
                      ? formatTimestamp(expense.timestamp, true)
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {expense.title || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">₹{expense.value || 0}</td>
                  <td className="py-2 px-4 border-b">
                    {expense.group || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {expense.splitMethod || "N/A"}
                  </td>
                  <td className="py-2 px-4 mt-2 flex items-center justify-center space-x-3">
                    <button onClick={() => setEditingExpense(expense)}>
                      <FaEdit fontSize="25px" />
                    </button>
                    <button onClick={() => deleteGroupExpense(expense.id)}>
                      <FaTrashCan className="text-red-500" fontSize="25px" />
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => setSelectedExpense(expense)}
                      className="text-md text-nowrap text-blue-500"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>

      {/* Small screen layout */}
      <div className="md:hidden mx-2 md:mx-4">
        {sortGroupExpenses.map(
          (expense) =>
            expense && (
              <div
                key={expense.id || Math.random()}
                className="bg-white border border-gray-200 rounded-lg mb-2 p-3"
                onClick={() => setSelectedExpense(expense)}
              >
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {expense.timestamp
                      ? formatTimestamp(expense.timestamp, true)
                      : "N/A"}
                  </div>
                  <div className="font-semibold">₹{expense.value || 0}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="mt-1 font-medium">
                    {expense.title || "N/A"}
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {expense.group || "N/A"}
                  </div>
                </div>
              </div>
            )
        )}
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
          onEdit={() => {
            setSelectedExpense(null);
            setEditingExpense(selectedExpense);
          }}
          onDelete={() => {
            deleteGroupExpense(selectedExpense.id);
            setSelectedExpense(null);
          }}
          isGroupExpense={true}
        />
      )}
    </div>
  );
};

const SafeGroupExpensesTable = (props) => (
  <ErrorBoundary>
    <GroupExpensesTable {...props} />
  </ErrorBoundary>
);

export default SafeGroupExpensesTable;
