import React, { useState } from "react";
import { useExpenses } from "../components/ExpenseContext"; 
import NewGroupModal from "./GroupModal";

const ExpenseTypeModal = ({ onContinue, onClose }) => {
  const [expenseType, setExpenseType] = useState("personal");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const { groups } = useExpenses();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative bg-white rounded-lg p-8 m-4 max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4">Add an expense</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expense Type
          </label>
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-full ${
                expenseType === "personal"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setExpenseType("personal")}
            >
              Personal
            </button>
            <button
              className={`px-4 py-2 rounded-full ${
                expenseType === "group"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setExpenseType("group")}
            >
              Group
            </button>
          </div>
        </div>
        {expenseType === "group" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Group
            </label>
            <div className="flex space-x-2">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="flex-grow p-2 border rounded"
              >
                <option value="">Select a group</option>
                {groups.map((group) => (
                  <option key={group.name} value={group.name}>
                    {group.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsNewGroupModalOpen(true)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                New Group
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-end space-x-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={() => onContinue(expenseType, selectedGroup)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Continue
          </button>
        </div>
      </div>
      {isNewGroupModalOpen && (
        <NewGroupModal onClose={() => setIsNewGroupModalOpen(false)} />
      )}
    </div>
  );
};

export default ExpenseTypeModal;
