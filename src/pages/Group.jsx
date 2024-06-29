import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useExpenses } from "../components/ExpenseContext";
import { BiX, BiPlus, BiPencil, BiTrash } from "react-icons/bi";

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

const Group = () => {
  const { groupName } = useParams();
  const { groups, setGroups, groupExpenses, username } = useExpenses();
  const [isModalOpen, setIsModalOpen] = useState(false);


  const decodedGroupName = decodeURIComponent(groupName);
  const group = groups.find((g) => g.name === decodedGroupName);

  if (!group) {
    return (
      <Layout title="Group Not Found">
        <div className="text-center text-red-500">
          The requested group could not be found.
        </div>
      </Layout>
    );
  }

  const removeMember = (memberToRemove) => {
    const updatedGroups = groups.map((g) => {
      if (g.name === group.name && g.members.length > 2) {
        return {
          ...g,
          members: g.members.filter((member) => member !== memberToRemove),
        };
      }
      return g;
    });
    setGroups(updatedGroups);
  };

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


  const calculateOwedMoney = (member) => {
    let owed = 0;
    groupExpenses
      .filter((expense) => expense.group === group.name)
      .forEach((expense) => {
        if (
          expense.payer === username[0] &&
          expense.splitAmong.includes(member)
        ) {
          owed += expense.value / expense.splitAmong.length;
        } else if (
          expense.payer === member &&
          expense.splitAmong.includes(username[0])
        ) {
          owed -= expense.value / expense.splitAmong.length;
        }
      });
    return owed;
  };
  return (
    <Layout title={`Group: ${group.name}`}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {group.name}
          </h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <BiPlus className="inline mr-1" /> Add Member
          </button>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {group.members.map((member, index) => (
              <li
                key={index}
                className="px-4 py-4 w-full sm:px-6 flex justify-between items-center"
              >
                <div>{member}</div>
                <div className="flex items-center">
                  {member !== username[0] && (
                    <span className="mr-4 text-sm text-gray-500">
                      {calculateOwedMoney(member) > 0
                        ? `${member} owes you ₹${calculateOwedMoney(
                            member
                          ).toFixed(2)}`
                        : calculateOwedMoney(member) < 0
                        ? `You owe ${member} ₹${Math.abs(
                            calculateOwedMoney(member)
                          ).toFixed(2)}`
                        : `You're settled with ${member}`}
                    </span>
                  )}
                  {group.members.length > 2 && member !== username[0] && (
                    <button
                      onClick={() => removeMember(member)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <BiX size={25} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addMember}
      />
    </Layout>
  );
};

export default Group;
