import React, { useEffect, useState } from "react";
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
  const [expenseCategory, setExpenseCategory] = useState("regular");
  const [payer, setPayer] = useState("everyone");
  const [date, setDate] = useState(new Date());
  const [splitMethod, setSplitMethod] = useState("equal");
  const [customSplits, setCustomSplits] = useState({});
  const [splitAmong, setSplitAmong] = useState([]);

  const { addPersonalExpense, addGroupExpense, groups } = useExpenses();

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (expenseType === "group") {
      const groupMembers =
        groups.find((g) => g.name === selectedGroup)?.members || [];
      setSplitAmong(groupMembers);
      const initialCustomSplits = {};
      groupMembers.forEach((member) => {
        initialCustomSplits[member] = "";
      });
      setCustomSplits(initialCustomSplits);
    }
  }, [expenseType, selectedGroup, groups]);

  const handleSplitAmongChange = (member, isChecked) => {
    if (isChecked) {
      setSplitAmong([...splitAmong, member]);
    } else {
      setSplitAmong(splitAmong.filter((m) => m !== member));

      // Deduct the unchecked member's amount from the total
      const updatedCustomSplits = { ...customSplits };
      delete updatedCustomSplits[member];
      setCustomSplits(updatedCustomSplits);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!date) newErrors.date = "Date is required";

    if (splitMethod === "equal") {
      if (!amount || amount <= 0) newErrors.amount = "Valid amount is required";
      if (expenseType === "group" && !payer)
        newErrors.payer = "Payer is required";
    } else {
      const totalCustomSplit = Object.values(customSplits).reduce(
        (sum, value) => sum + (parseFloat(value) || 0),
        0
      );
      if (totalCustomSplit <= 0)
        newErrors.customSplits = "Total amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const totalAmount =
      splitMethod === "equal"
        ? parseFloat(amount)
        : Object.values(customSplits).reduce(
            (sum, value) => sum + (parseFloat(value) || 0),
            0
          );
console.log('expenseCategory :>> ', expenseCategory);
    const newExpense = {
      id: uuidv4(),
      title,
      desc: description,
      value: totalAmount,
      date,
      type: expenseType,
      expenseCategory: expenseType == "personal" ? expenseCategory : null,
      group: expenseType === "group" ? selectedGroup : null,
      payer:
        splitMethod === "equal"
          ? payer === "everyone"
            ? "everyone"
            : payer
          : "custom",
      splitMethod,
      splitAmong:
        expenseType === "group"
          ? splitMethod === "equal"
            ? groups.find((g) => g.name === selectedGroup)?.members
            : splitAmong
          : null,
      splitAmounts: splitMethod === "custom" ? customSplits : {},
    };

    if (expenseType === "personal") {
      addPersonalExpense(newExpense);
    } else {
      addGroupExpense(newExpense);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 h-auto w-full z-50 flex justify-center items-center">
      <div className="relative bg-white rounded-lg p-4 md:p-8 m-4 max-w-4xl w-full overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-bold mb-6">Add Expense Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
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
            {(splitMethod === "equal" || expenseType === "personal") && (
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
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                className="w-full p-2 border rounded"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            {expenseType === "personal" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Type
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="regular">Regular Expense</option>
                  <option value="borrowed">Money Borrowed</option>
                  <option value="lent">Money Lent</option>
                </select>
              </div>
            )}
            {expenseType === "group" && splitMethod === "equal" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paid by
                </label>
                <select
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  className={`w-full p-2 border rounded ${
                    errors.payer ? "border-red-500" : ""
                  }`}
                >
                  <option value="everyone">Everyone</option>
                  {splitAmong.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
                {errors.payer && (
                  <p className="text-red-500 text-sm mt-1">{errors.payer}</p>
                )}
              </div>
            )}
            {expenseType === "group" && (
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
            )}
          </div>
          {expenseType === "group" && splitMethod === "custom" && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Split Among
              </label>
              <div className="grid grid-cols-3 gap-2">
                {groups
                  .find((g) => g.name === selectedGroup)
                  ?.members.map((member) => (
                    <label key={member} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={splitAmong.includes(member)}
                        onChange={(e) =>
                          handleSplitAmongChange(member, e.target.checked)
                        }
                        className="mr-2"
                      />
                      {member}
                    </label>
                  ))}
              </div>
              {errors.splitAmong && (
                <p className="text-red-500 text-sm mt-1">{errors.splitAmong}</p>
              )}
            </div>
          )}

          {expenseType === "group" && splitMethod === "custom" && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Custom Split
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {splitAmong.map((member) => (
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
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-700">
                  Total Amount:{" "}
                  {Object.values(customSplits)
                    .reduce((sum, value) => sum + (parseFloat(value) || 0), 0)
                    .toFixed(2)}
                </p>
                {errors.customSplits && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.customSplits}
                  </p>
                )}
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
