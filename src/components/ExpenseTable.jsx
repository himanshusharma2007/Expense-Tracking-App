import React from "react";
import formatTimestamp from "../utils/dateFormatters";
const ExpenseTable = ({ title, expense, group }) => {
  if (!expense) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
        {title}
      </h3>

      {/* Large screen table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {group ? "Group" : "Category"}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 text-center py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {expense.title}
              </td>
              <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-500">
                ₹{expense.value.toFixed(2)}
              </td>
              <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-500">
                {formatTimestamp(expense.timestamp, true)}
              </td>
              <td className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-500">
                {expense.type === "personal"
                  ? expense.expenseCategory
                  : expense.group.name}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Small screen layout */}
      <div className="md:hidden bg-white rounded-lg shadow overflow-hidden p-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Title:</span>
            <span className="text-sm text-gray-900">{expense.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Amount:</span>
            <span className="text-sm text-gray-900">
              ₹{expense.value.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">Date:</span>
            <span className="text-sm text-gray-900">
              {formatTimestamp(expense.timestamp, true)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-500">
              {group ? "Group" : "Category"}:
            </span>
            <span className="text-sm text-gray-900">
              {expense.type === "personal"
                ? expense.expenseCategory
                : expense.group.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExpenseTable