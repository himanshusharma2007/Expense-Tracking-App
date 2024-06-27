import React, { useState } from "react";
import { useExpenses } from "./ExpenseContext";
import { BiPlus, BiX } from "react-icons/bi"; // Make sure to install react-icons

const NewGroupModal = ({ onClose, isOpen }) => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState(["", ""]);
  const { groups, setGroup } = useExpenses();
  if (!isOpen) {
    return;
  }
  const handleAddMember = () => {
    setMembers([...members, ""]);
  };

  const handleRemoveMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGroup = {
      name: groupName,
      members: members.filter((member) => member.trim() !== ""),
    };
    setGroup([...groups, newGroup]);
    onClose();
  };

  return (
    <div className="relative top-20 ml-4 p-5 border w-96 shadow-lg rounded-md bg-white">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        Create New Group
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="groupName"
            className="block text-sm font-medium text-gray-700"
          >
            Group Name
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            placeholder="Enter group name"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Members
          </label>
          {members.map((member, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder={`Member ${index + 1}`}
                required
              />
              {members.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <BiX size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMember}
            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <BiPlus className="mr-1" /> Add Member
          </button>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewGroupModal;
