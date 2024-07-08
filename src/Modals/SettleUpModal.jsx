import React, { useState, useEffect } from "react";
import { useExpenses } from "../components/ExpenseContext";

const SettleUpModal = ({ isOpen, onClose, groupName }) => {
  const { groups, setGroups, username } = useExpenses();
  const [step, setStep] = useState(1);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [amount, setAmount] = useState("");
  const [settlements, setSettlements] = useState([]);
  const [isFullPayment, setIsFullPayment] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const group = groups.find((g) => g.name === groupName);
      if (group && group.memberBalances) {
        const allSettlements = [];
        Object.entries(group.memberBalances).forEach(([member, balances]) => {
          Object.entries(balances).forEach(([otherMember, balance]) => {
            if (balance < 0) {
              // Changed to balance < 0
              allSettlements.push({
                to: otherMember, // Swapped member and otherMember
                from: member,
                amount: balance, // Use balance directly, not Math.abs
              });
            }
          });
        });

        // Sort settlements: user's settlements first, then by amount
        allSettlements.sort((a, b) => {
          const aInvolvesUser = a.to === username[0] || a.from === username[0];
          const bInvolvesUser = b.to === username[0] || b.from === username[0];
          if (aInvolvesUser && !bInvolvesUser) return -1;
          if (!aInvolvesUser && bInvolvesUser) return 1;
          return b.amount - a.amount;
        });

        setSettlements(allSettlements);
      }
      setStep(1);
      setSelectedSettlement(null);
      setAmount("");
      setIsFullPayment(true);
    }
  }, [isOpen, groupName, groups, username]);

  const handleSettlementSelect = (settlement) => {
    setSelectedSettlement(settlement);
    setAmount(settlement.amount.toString());
    setStep(2);
  };

  const handleSettle = () => {
    const settleAmount = isFullPayment
      ? selectedSettlement.amount
      : parseFloat(amount);

    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.name === groupName) {
          const updatedBalances = JSON.parse(
            JSON.stringify(group.memberBalances)
          );

          // Update balances for both members
          updatedBalances[selectedSettlement.from][selectedSettlement.to] -=
            settleAmount;
          if (updatedBalances[selectedSettlement.to]) {
            updatedBalances[selectedSettlement.to][selectedSettlement.from] =
              (updatedBalances[selectedSettlement.to][
                selectedSettlement.from
              ] || 0) + settleAmount;
          } else {
            updatedBalances[selectedSettlement.to] = {
              [selectedSettlement.from]: settleAmount,
            };
          }

          // Remove zero balances
          if (
            updatedBalances[selectedSettlement.from][selectedSettlement.to] ===
            0
          ) {
            delete updatedBalances[selectedSettlement.from][
              selectedSettlement.to
            ];
          }
          if (
            updatedBalances[selectedSettlement.to][selectedSettlement.from] ===
            0
          ) {
            delete updatedBalances[selectedSettlement.to][
              selectedSettlement.from
            ];
          }

          // Remove empty member entries
          Object.keys(updatedBalances).forEach((member) => {
            if (Object.keys(updatedBalances[member]).length === 0) {
              delete updatedBalances[member];
            }
          });

          const settlementActivity = {
            type: "settlement",
            from: selectedSettlement.to,
            to: selectedSettlement.from,
            amount: Math.abs(settleAmount),
            groupName: groupName,
            timestamp: new Date().toISOString(),
          };

          // Add the settlement activity to the group's activities
          const updatedGroup = {
            ...group,
            memberBalances: updatedBalances,
            activities: [...(group.activities || []), settlementActivity],
          };

          return updatedGroup;
        }
        return group;
      })
    );

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        {step === 1 && (
          <>
            <h3 className="text-lg font-semibold mb-4">Select a settlement</h3>
            <ul className="mb-4 divide-y divide-gray-200">
              {settlements.map((settlement, index) => (
                <li
                  key={index}
                  className={`cursor-pointer p-3 hover:bg-gray-100 ${
                    settlement.to === username[0] ||
                    settlement.from === username[0]
                      ? "bg-blue-50 hover:bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleSettlementSelect(settlement)}
                >
                  <div className="font-medium">
                    {settlement.to} owes {settlement.from}
                  </div>
                  <div className="text-sm text-gray-600">
                    ₹{Math.abs(settlement.amount).toFixed(2)}
                  </div>
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
        {step === 2 && selectedSettlement && (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Settle: {selectedSettlement.to} to {selectedSettlement.from}
            </h3>
            <div className="mb-4">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={isFullPayment}
                  onChange={(e) => setIsFullPayment(e.target.checked)}
                  className="mr-2"
                />
                Full Payment (₹{Math.abs(selectedSettlement.amount).toFixed(2)})
              </label>
              {!isFullPayment && (
                <input
                  type="number"
                  value={Math.abs(amount)}
                  onChange={(e) => setAmount(e.target.value)}
                  max={selectedSettlement.amount}
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
                disabled={
                  !isFullPayment &&
                  (parseFloat(amount) <= 0 ||
                    parseFloat(amount) > selectedSettlement.amount)
                }
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
