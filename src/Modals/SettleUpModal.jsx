// SettleUpModal.jsx
import React, { useState, useEffect } from "react";
import { useExpenses } from "../components/ExpenseContext";

const SettleUpModal = ({ isOpen, onClose, groupName }) => {
  const { groupExpenses, username, updateGroupExpense ,setGroups} = useExpenses();
  const [step, setStep] = useState(1);
  const [selectedMember, setSelectedMember] = useState(null);
  const [amount, setAmount] = useState(0);
  const [membersToSettle, setMembersToSettle] = useState([]);
  const [isFullPayment, setIsFullPayment] = useState(false);

  useEffect(() => {
    const calculateMembersToSettle = () => {
      const members = {};
      groupExpenses
        .filter((expense) => expense.group === groupName)
        .forEach((expense) => {
          if (expense.payer === username[0]) {
            expense.splitAmong.forEach((member) => {
              if (member !== username[0]) {
                members[member] =
                  (members[member] || 0) +
                  expense.value / expense.splitAmong.length;
              }
            });
          } else if (expense.splitAmong.includes(username[0])) {
            const payer = expense.payer;
            members[payer] =
              (members[payer] || 0) - expense.value / expense.splitAmong.length;
          }
        });
      setMembersToSettle(
        Object.entries(members).filter(([_, amount]) => amount !== 0)
      );
    };

    if (isOpen) {
      calculateMembersToSettle();
      setStep(1);
      setSelectedMember(null);
      setAmount(0);
      setIsFullPayment(false);
    }
  }, [isOpen, groupName, groupExpenses, username]);

  const handleMemberSelect = (member, amount) => {
    setSelectedMember(member);
    setAmount(Math.abs(amount));
    setStep(2);
  };

const handleSettle = () => {
  const settleAmount = isFullPayment ? amount : parseFloat(amount);

  setGroups((prevGroups) =>
    prevGroups.map((group) => {
      if (group.name === groupName) {
        const updatedBalances = { ...group.balances };
        if (settleAmount > 0) {
          // User is receiving money
          updatedBalances[selectedMember] =
            (updatedBalances[selectedMember] || 0) - settleAmount;
          updatedBalances[username[0]] =
            (updatedBalances[username[0]] || 0) + settleAmount;
        } else {
          // User is paying money
          updatedBalances[selectedMember] =
            (updatedBalances[selectedMember] || 0) + Math.abs(settleAmount);
          updatedBalances[username[0]] =
            (updatedBalances[username[0]] || 0) - Math.abs(settleAmount);
        }
        return { ...group, balances: updatedBalances };
      }
      return group;
    })
  );

  onClose();
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96">
        {step === 1 && (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Select a member to settle up with
            </h3>
            <ul className="mb-4">
              {membersToSettle.map(([member, amount]) => (
                <li
                  key={member}
                  className="cursor-pointer p-2 hover:bg-gray-100"
                  onClick={() => handleMemberSelect(member, amount)}
                >
                  {member} (
                  {amount > 0
                    ? `owes you ₹${amount.toFixed(2)}`
                    : `you owe ₹${(-amount).toFixed(2)}`}
                  )
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Settle up with {selectedMember}
            </h3>
            <div className="mb-4">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={isFullPayment}
                  onChange={(e) => setIsFullPayment(e.target.checked)}
                  className="mr-2"
                />
                Full Payment (₹{amount.toFixed(2)})
              </label>
              {!isFullPayment && (
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleSettle}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Settle
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettleUpModal;
