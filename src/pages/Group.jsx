import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useExpenses } from "../components/ExpenseContext";
import { BiPlus, BiX } from "react-icons/bi";
import { FaHandshakeSimple } from "react-icons/fa6";
import SettleUpModal from "../Modals/SettleUpModal";
import GroupExpensesTable from "../components/GxTable";

const AddMemberModal = ({ isOpen, onClose, onAdd }) => {
  const [newMember, setNewMember] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMember.trim()) {
      onAdd(newMember.trim());
      setNewMember("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Add New Member</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Member name"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MemberDetailsModal = ({ isOpen, onClose, member, group }) => {
  if (!isOpen || !member) return null;

  const memberBalances = group.memberBalances?.[member] || {};

  const owesToOthers = Object.entries(memberBalances).filter(
    ([_, balance]) => balance > 0
  );
  const othersOwe = Object.entries(memberBalances).filter(
    ([_, balance]) => balance < 0
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative bg-white rounded-lg p-8 m-4 max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-4">{member}'s balance</h2>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            {member} owes to members
          </h3>
          {owesToOthers.length > 0 ? (
            <ul>
              {owesToOthers.map(([otherMember, balance]) => (
                <li key={otherMember} className="mb-1">
                  {member} owes {balance.toFixed(2)} to {otherMember}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">
              {member} doesn't owe money to anyone.
            </p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Members who owe to {member}
          </h3>
          {othersOwe.length > 0 ? (
            <ul>
              {othersOwe.map(([otherMember, balance]) => (
                <li key={otherMember} className="mb-1">
                  {otherMember} owes {Math.abs(balance).toFixed(2)} to {member}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 italic">
              No one owes money to {member}.
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Group = () => {
  const { groupName } = useParams();
  const { groups, setGroups, username, groupExpenses } = useExpenses();
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isSettleUpModalOpen, setIsSettleUpModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const decodedGroupName = decodeURIComponent(groupName);
  const group = groups.find((g) => g.name === decodedGroupName);
  const [thisGroupExpenses, setThisGroupExpenses] = useState([]);
  useEffect(() => {
    const expenses = groupExpenses.filter(
      (expense) => expense.group === groupName
    );
    setThisGroupExpenses(expenses);
  }, [groupName, groupExpenses]); 
  if (!group) {
    return (
      <Layout title="Group Not Found">
        <div className="text-center text-red-500">
          The requested group could not be found.
        </div>
      </Layout>
    );
  }

  const addMember = (newMember) => {
    const updatedGroups = groups.map((g) => {
      if (g.name === group.name) {
        return {
          ...g,
          members: [...g.members, newMember],
        };
      }
      return g;
    });
    setGroups(updatedGroups);
  };

  const removeMember = (memberToRemove) => {
    if (group.members.length <= 2) {
      alert("A group must have at least two members.");
      return;
    }
    const updatedGroups = groups.map((g) => {
      if (g.name === group.name) {
        return {
          ...g,
          members: g.members.filter((member) => member !== memberToRemove),
          memberBalances: Object.fromEntries(
            Object.entries(g.memberBalances || {}).filter(
              ([member]) => member !== memberToRemove
            )
          ),
        };
      }
      return g;
    });
    setGroups(updatedGroups);
  };

  return (
    <Layout title={`Group: ${group.name}`}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6 mx-2">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {group.name}
          </h3>
          <div className="btns flex flex-row-reverse md:flex-row items-center md:space-x-3">
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-center items-center"
            >
              <BiPlus fontSize={25} className="inline mr-1 " />
              <span className="hidden md:block">Add Member</span>
            </button>
            <button
              onClick={() => setIsSettleUpModalOpen(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 mr-2 md:mr-0 flex justify-center items-center"
            >
              <FaHandshakeSimple fontSize={25} className="inline mr-1" />
              <span className="hidden md:block">Settle Up</span>
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {group.members.map((member, index) => (
              <li
                key={index}
                className="px-4 py-4 w-full sm:px-6 flex justify-between items-center"
              >
                <div>{member}</div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Details
                  </button>
                  {member !== username[0] && group.members.length > 2 && (
                    <button
                      onClick={() => removeMember(member)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <BiX size={20} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8 mx-2">
        <h1 className="text-lg font-semibold mb-2">Expenses of This Group</h1>
        <GroupExpensesTable thisGroupExpenses={thisGroupExpenses} />
      </div>
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onAdd={addMember}
      />
      <SettleUpModal
        isOpen={isSettleUpModalOpen}
        onClose={() => setIsSettleUpModalOpen(false)}
        groupName={decodedGroupName}
      />
      <MemberDetailsModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
        group={group}
      />
    </Layout>
  );
};

export default Group;
