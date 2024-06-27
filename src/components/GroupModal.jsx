import React, { useState } from "react";
import { useExpenses } from "./ExpenseContext";

const NewGroupModal = ({ onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [memberNames, setMemberNames] = useState(["", ""]);
  const { setGroups, groups } = useExpenses();

  const handleAddGroup = () => {
    if (groupName.trim() !== "") {
      const members = memberNames.filter((name) => name.trim() !== "");
      setGroups([...groups, { name: groupName, members }]);
      setGroupName("");
      setMemberNames(["", ""]);
      onClose();
    }
  };

  const handleAddMemberField = () => {
    setMemberNames([...memberNames, ""]);
  };

  const handleRemoveMemberField = (index) => {
    const newMemberNames = memberNames.filter((_, i) => i !== index);
    setMemberNames(newMemberNames);
  };

  const handleMemberNameChange = (index, value) => {
    const newMemberNames = memberNames.slice();
    newMemberNames[index] = value;
    setMemberNames(newMemberNames);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-start">
      <div className="relative flex justify-center items-center top-20 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 w-full p-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
            Add New Group
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
          <div className="mt-2">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2 px-3"
              placeholder="Enter group name"
            />
            <div className="mt-4">
              <label
                htmlFor="memberNames"
                className="block text-sm font-medium text-gray-700"
              >
                Member Names
              </label>
              {memberNames.map((name, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      handleMemberNameChange(index, e.target.value)
                    }
                    className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 py-2 px-3"
                    placeholder="Enter member name"
                  />
                  {memberNames.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMemberField(index)}
                      className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMemberField}
                className="mt-2 ml-2 inline-flex  rounded-md   bg-white text-base font-medium w-fit h-fit text-blue-500 hover:text-blue-600 sm:text-sm"
              >
               + Add Member
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddGroup}
              className="mt-4 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Add Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewGroupModal;
