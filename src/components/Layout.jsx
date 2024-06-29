import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  MdDashboard,
  MdAttachMoney,
  MdPerson,
  MdGroup,
  MdGroups,
} from "react-icons/md";
import ExpenseTypeModal from "../Modals/ExpenseTypeModal";
import AddExpenseModal from "../Modals/AddExpenseModal";
import NewGroupModal from "../Modals/GroupModal";
import { useExpenses } from "./ExpenseContext";
import { BsActivity } from "react-icons/bs";

const sidebarItems = [
  { name: "Dashboard", path: "/dashboard", icon: <MdDashboard /> },
  { name: "Activity", path: "/activity", icon: <BsActivity /> },
  { name: "All Expenses", path: "/all-expenses", icon: <MdAttachMoney /> },
  { name: "Personal Expenses", path: "/personal-expenses", icon: <MdPerson /> },
  { name: "Group Expenses", path: "/group-expenses", icon: <MdGroup /> },
];

const Layout = ({ children, title, firstname }) => {
  const location = useLocation();
  const [showExpenseTypeModal, setShowExpenseTypeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [initialExpenseType, setInitialExpenseType] = useState("");
  const [initialGroup, setInitialGroup] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const { groups, setGroups } = useExpenses();
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");

  const handleAddExpense = () => {
    setShowExpenseTypeModal(true);
  };

  const handleExpenseTypeContinue = (expenseType, selectedGroup) => {
    setShowExpenseTypeModal(false);
    setInitialExpenseType(expenseType);
    setInitialGroup(selectedGroup);
    setShowAddExpenseModal(true);
  };

  const handleCloseModals = () => {
    setShowExpenseTypeModal(false);
    setShowAddExpenseModal(false);
  };

  const handleEditGroup = (groupId, currentName) => {
    setEditingGroupId(groupId);
    setNewGroupName(currentName);
  };

  const handleSaveGroupEdit = (groupId) => {
    if (newGroupName.trim()) {
      const updatedGroups = groups.map((group) =>
        group.id === groupId ? { ...group, name: newGroupName.trim() } : group
      );
      setGroups(updatedGroups);
    }
    setEditingGroupId(null);
    setNewGroupName("");
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      const updatedGroups = groups.filter((group) => group.id !== groupId);
      setGroups(updatedGroups);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <nav className="mt-5">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center py-2 px-4 my-2 rounded transition-colors duration-200 ${
                location.pathname === item.path
                  ? "bg-gray-900 text-white"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
          {/* Groups Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsGroupsOpen(!isGroupsOpen)}
              className="w-full flex justify-between items-center py-2 px-4 my-2 rounded transition-colors duration-200 text-gray-400 hover:bg-gray-700"
            >
              <span className="flex items-center">
                <MdGroups className="mr-3" />
                Groups
              </span>
              {isGroupsOpen ? <BiChevronUp /> : <BiChevronDown />}
            </button>
            {isGroupsOpen && (
              <div className="pl-4">
                {groups.map((group) => (
                  <div key={group.id} className="relative group">
                    {editingGroupId === group.id ? (
                      <div className="flex items-center py-2 px-4">
                        <input
                          type="text"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                        />
                        <button
                          onClick={() => handleSaveGroupEdit(group.id)}
                          className="ml-2 text-green-500 hover:text-green-400"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    ) : (
                      <Link
                        to={`/group/${encodeURIComponent(group.name)}`}
                        className="block py-2 px-4 text-sm text-gray-400 hover:bg-gray-700 rounded"
                      >
                        {group.name}
                      </Link>
                    )}
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden group-hover:flex items-center bg-gray-800 px-2 py-1 rounded">
                      <button
                        onClick={() => handleEditGroup(group.id, group.name)}
                        className="text-blue-500 hover:text-blue-400 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setIsGroupModalOpen(true)}
                  className="w-full text-left py-2 px-4 text-sm text-blue-400 hover:bg-gray-700 rounded"
                >
                  + Add New Group
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 relative overflow-x-hidden overflow-y-auto ">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
            <button
              onClick={handleAddExpense}
              className={`${
                firstname && `absolute top-24 z-10 right-10`
              } bg-blue-500 hover:bg-blue-600  text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105`}
            >
              Add New Expense
            </button>
            {firstname && (
              <div className="username capitalize font-bold text-3xl">
                welcome {firstname}
              </div>
            )}
          </div>
          {children}
        </div>
      </main>

      {showExpenseTypeModal && (
        <ExpenseTypeModal
          onContinue={handleExpenseTypeContinue}
          onClose={handleCloseModals}
        />
      )}
      {showAddExpenseModal && (
        <AddExpenseModal
          isOpen={showAddExpenseModal}
          onClose={handleCloseModals}
          initialExpenseType={initialExpenseType}
          initialGroup={initialGroup}
        />
      )}
      {isGroupModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-start">
          <NewGroupModal isOpen onClose={() => setIsGroupModalOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default Layout;
