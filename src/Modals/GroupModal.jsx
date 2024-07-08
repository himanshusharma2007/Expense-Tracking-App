import React, { useState } from "react";
import { useExpenses } from "../components/ExpenseContext";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
const NewGroupModal = ({ onClose }) => {
  const { setGroups, groups, username } = useExpenses();
  const [groupName, setGroupName] = useState("");
  const [memberNames, setMemberNames] = useState([""]); // Start with one empty field for additional members
 const navigate =useNavigate()
 const handleAddGroup = () => {
   if (groupName.trim() !== "") {
     if (groups.some((group) => group.name === groupName.trim())) {
       alert(
         "A group with this name already exists. Please choose a different name."
       );
       return;
     }
     const members = [
       username[0],
       ...memberNames.filter((name) => name.trim() !== ""),
     ];
     if (members.length < 2) {
       alert("Please add at least 1 other member to the group.");
       return;
     }

     // Initialize memberBalances
     const memberBalances = {};
     members.forEach((member) => {
       memberBalances[member] = {};
       members.forEach((otherMember) => {
         if (member !== otherMember) {
           memberBalances[member][otherMember] = 0;
         }
       });
     });
     console.log('memberBalances :>> ', memberBalances);

     setGroups([
       ...groups,
       {
         id: uuidv4(),
         name: groupName.trim(),
         memberBalances, // Use the initialized memberBalances here
         members,
         timestamp: new Date().toISOString(),
       },
     ]);
     setGroupName("");
     setMemberNames([""]);
     onClose();
     navigate(`/group/${groupName}`)
   }
 };

  const handleAddMemberField = () => {
    if (memberNames.length < 9) {
      // Max 10 members including the user
      setMemberNames([...memberNames, ""]);
    } else {
      alert("Maximum number of members reached.");
    }
  };

  const handleRemoveMemberField = (index) => {
    const newMemberNames = memberNames.filter((_, i) => i !== index);
    setMemberNames(newMemberNames);
  };

  const handleMemberNameChange = (index, value) => {
    const newMemberNames = memberNames.slice();
    if (
      [username[0], ...newMemberNames].includes(value.trim()) &&
      value.trim() !== ""
    ) {
      alert("This member name already exists in the group.");
      return;
    }
    newMemberNames[index] = value;
    setMemberNames(newMemberNames);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-start mx-2">
      <div className="relative flex justify-center items-center top-20 border w-72 md:w-96 shadow-lg rounded-md bg-white">
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
              <label className="block text-sm font-medium text-gray-700">
                Group Members
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  value={username[0]}
                  readOnly
                  className="w-full rounded-md border-gray-300 shadow-sm bg-gray-100 py-2 px-3"
                />
              </div>
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
                  <button
                    type="button"
                    onClick={() => handleRemoveMemberField(index)}
                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMemberField}
                className="mt-2 ml-2 inline-flex rounded-md bg-white text-base font-medium w-fit h-fit text-blue-500 hover:text-blue-600 sm:text-sm"
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
