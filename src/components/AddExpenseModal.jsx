import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useExpenses } from "./ExpenseContext";
import { BiPlus } from "react-icons/bi";
import NewGroupModal from "./GroupModal";
import { v4 as uuidv4 } from "uuid";

const AddExpenseModal = ({ isOpen = true, onClose }) => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [expenseType, setExpenseType] = useState("personal");
  const [expenseValue, setExpenseValue] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const { addPersonalExpense, addGroupExpense, groups } = useExpenses();

  if (!isOpen) return null;

  const inputStyle =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2 px-3";

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: uuidv4(),
      title: title,
      desc: description,
      value: parseFloat(expenseValue),
      date: selectedDate,
      type: expenseType,
      group: expenseType === "group" ? selectedGroup : null,
    };

    if (expenseType === "personal") {
      addPersonalExpense(newExpense);
    } else {
      addGroupExpense(newExpense);
    }

    // Clear form and close modal
    setDescription("");
    setExpenseValue("");
    setExpenseType("personal");
    setSelectedGroup("");
    setSelectedDate(new Date());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-start">
      <div className="relative flex justify-center items-center top-20 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 w-full p-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
            Add New Expense
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
                htmlFor="title"
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
                <label
                  htmlFor="group"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Group
                </label>
                <div className="mt-1 flex">
                  <select
                    id="group"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className={`${inputStyle} flex-grow`}
                  >
                    <option value="">Select a group</option>
                    {groups.map((group) => (
                      <option key={group.name} value={group.name}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsNewGroupModalOpen(true)}
                    className="ml-2 inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <BiPlus fontSize="30px" />
                  </button>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="expenseDate"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <div className="relative">
                <div className="flex items-center">
                  <span className={`${inputStyle} flex-grow`}>
                    {selectedDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className="ml-2 inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
                {isDatePickerOpen && (
                  <div className="absolute z-10 mt-1 -top-[18rem] right-0">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setIsDatePickerOpen(false);
                      }}
                      inline
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              >
                Add Expense
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

export default AddExpenseModal;
