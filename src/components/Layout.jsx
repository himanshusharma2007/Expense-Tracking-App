import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import ExpenseTypeModal from "../Modals/ExpenseTypeModal"; 
import AddExpenseModal from "../Modals/AddExpenseModal";
import NewGroupModal from "../Modals/GroupModal";
import { useExpenses } from "./ExpenseContext";

const sidebarItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Activity", path: "/activity" },
  { name: "All Expenses", path: "/all-expenses" },
  { name: "Personal Expenses", path: "/personal-expenses" },
  { name: "Group Expenses", path: "/group-expenses" },
];

const Layout = ({ children, title, firstname }) => {
  const location = useLocation();
  const [showExpenseTypeModal, setShowExpenseTypeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [initialExpenseType, setInitialExpenseType] = useState("");
  const [initialGroup, setInitialGroup] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const { groups } = useExpenses();

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <nav className="mt-5">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block py-2 px-4 my-2 rounded transition-colors duration-200 ${
                location.pathname === item.path
                  ? "bg-gray-900 text-white"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
          {/* Groups Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsGroupsOpen(!isGroupsOpen)}
              className="w-full flex justify-between items-center py-2 px-4 my-2 rounded transition-colors duration-200 text-gray-400 hover:bg-gray-700"
            >
              Groups
              {isGroupsOpen ? <BiChevronUp /> : <BiChevronDown />}
            </button>
            {isGroupsOpen && (
              <div className="pl-4">
                {groups.map((group, index) => (
                  <Link
                    key={index}
                    to={`/group/${encodeURIComponent(group.name)}`}
                    className="block py-2 px-4 text-sm text-gray-400 hover:bg-gray-700 rounded"
                  >
                    {group.name}
                  </Link>
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
              <div className="username capitalize font-semibold text-3xl">
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
