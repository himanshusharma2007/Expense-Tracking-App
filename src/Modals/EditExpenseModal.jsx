import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useExpenses } from "../components/ExpenseContext";
import NewGroupModal from "./GroupModal";
import { BiPlus } from "react-icons/bi";

const EditExpenseModal = ({ isOpen, onClose, expense }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expenseType, setExpenseType] = useState("personal");
  const [expenseValue, setExpenseValue] = useState("");
const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);

  const { updatePersonalExpense, updateGroupExpense ,groups} = useExpenses();
//   const existingGroups = ["Family", "Friends", "Work"];

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setDescription(expense.desc);
      setExpenseValue(expense.value.toString());
      setExpenseType(expense.type);
     setSelectedGroup(expense.group ? expense.group.name : "");
      setSelectedDate(new Date(expense.date));
    }
  }, [expense]);

  if (!isOpen) return null;

  const inputStyle =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2 px-3";

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedExpense = {
      ...expense,
      title: title,
      desc: description,
      value: parseFloat(expenseValue),
      date: selectedDate,
      type: expenseType,
      group:
        expenseType === "group"
          ? groups.find((g) => g.name === selectedGroup)
          : null,
    };

    if (expenseType === "personal") {
      updatePersonalExpense(updatedExpense);
    } else {
      updateGroupExpense(updatedExpense);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative flex justify-center sm:items-center  border w-72 md:w-96 shadow-lg rounded-md bg-white max-h-[80vh] h-auto overflow-y-auto p-2">
        <div className="mt-3 w-full p-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
            Edit Expense
          </h3>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <form onSubmit={handleSubmit} className="mt-2">
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputStyle}
                placeholder="Enter expense title"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={inputStyle}
                placeholder="Enter expense description"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="expenseValue"
                className="block text-sm font-medium text-gray-700"
              >
                Expense Value
              </label>
              <input
                type="number"
                id="expenseValue"
                value={expenseValue}
                onChange={(e) => setExpenseValue(e.target.value)}
                className={inputStyle}
                placeholder="Enter expense value"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="expenseType"
                className="block text-sm font-medium text-gray-700"
              >
                Expense Type
              </label>
              <select
                id="expenseType"
                value={expenseType}
                onChange={(e) => setExpenseType(e.target.value)}
                className={inputStyle}
              >
                <option value="personal">Personal</option>
                <option value="group">Group</option>
              </select>
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
                    className="px-4 py-2 bg-green-500 text-white rounded flex justify-center items-center w-[40%]"
                  >
                    <BiPlus fontSize="25px" />{" "}
                    
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 ">
              <button
                type="submit"
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              >
                Update Expense
              </button>
            </div>
          </form>
        </div>
      </div>
      {isNewGroupModalOpen && (
        <NewGroupModal onClose={() => setIsNewGroupModalOpen(false)} />
      )}
    </div>
  );
};

export default EditExpenseModal;
