import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useExpenses } from "../components/ExpenseContext"; 
import { v4 as uuidv4 } from "uuid";

const AddExpenseModal = ({
  isOpen,
  onClose,
  initialExpenseType,
  initialGroup,
}) => {
  const [expenseType] = useState(initialExpenseType);
  const [selectedGroup] = useState(initialGroup);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [date, setDate] = useState(new Date());
  const [splitMethod, setSplitMethod] = useState("equal");
  const [customSplits, setCustomSplits] = useState({});

  const { addPersonalExpense, addGroupExpense, groups } = useExpenses();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExpense = {
      id: uuidv4(),
      title: title,
      desc: description,
      value: parseFloat(amount),
      date: date,
      type: expenseType,
      group: expenseType === "group" ? selectedGroup : null,
      payer: payer,
      splitMethod: splitMethod,
      splitAmounts: splitMethod === "custom" ? customSplits : {},
    };

    if (expenseType === "personal") {
      addPersonalExpense(newExpense);
    } else {
      addGroupExpense(newExpense);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative bg-white rounded-lg p-8 m-4 max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-6">Add Expense Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter expense title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                className="w-full p-2 border rounded"
              />
            </div>
            {expenseType === "group" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paid by
                  </label>
                  <select
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select payer</option>
                    {groups
                      .find((g) => g.name === selectedGroup)
                      ?.members.map((member) => (
                        <option key={member} value={member}>
                          {member}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Split Method
                  </label>
                  <select
                    value={splitMethod}
                    onChange={(e) => setSplitMethod(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="equal">Split equally</option>
                    <option value="custom">Custom amounts</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {expenseType === "group" && splitMethod === "custom" && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Custom Split
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {groups
                  .find((g) => g.name === selectedGroup)
                  ?.members.map((member) => (
                    <div key={member}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {member}
                      </label>
                      <input
                        type="number"
                        value={customSplits[member] || ""}
                        onChange={(e) =>
                          setCustomSplits({
                            ...customSplits,
                            [member]: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                        placeholder="Amount"
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
