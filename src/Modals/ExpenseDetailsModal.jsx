import React from "react";
import { FaEdit } from "react-icons/fa";
import formatTimestamp from "../utils/dateFormatters";
import { FaTrashCan } from "react-icons/fa6";

const ExpenseDetailsModal = ({
  isOpen,
  onClose,
  expense,
  onEdit,
  onDelete,
  isGroupExpense,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Expense Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <p>
            <strong>Date:</strong> {formatTimestamp(expense.timestamp, true)}
          </p>
          <p>
            <strong>Title:</strong> {expense.title}
          </p>
          <p>
            <strong>Description:</strong> {expense.desc}
          </p>
          <p>
            <strong>Amount:</strong> ₹{expense.value}
          </p>
          {isGroupExpense && (
            <p>
              <strong>Group:</strong> {expense.group}
            </p>
          )}
        </div>
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onEdit}
            className="mr-2 text-blue-500 hover:text-blue-700"
          >
            <FaEdit fontSize="20px" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrashCan fontSize="20px" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailsModal;
