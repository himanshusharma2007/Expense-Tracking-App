import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BiChevronDown, BiChevronUp, BiUserCircle } from "react-icons/bi";
import { FaEdit, FaPlus, FaTrashAlt, FaUser } from "react-icons/fa";
import {
  MdDashboard,
  MdAttachMoney,
  MdPerson,
  MdGroup,
  MdGroups,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { Drawer, IconButton, useMediaQuery, useTheme } from "@mui/material";
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

const Layout = ({ children, title }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showExpenseTypeModal, setShowExpenseTypeModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [initialExpenseType, setInitialExpenseType] = useState("");
  const [initialGroup, setInitialGroup] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isGroupsOpen, setIsGroupsOpen] = useState(false);
  const { groups, setGroups } = useExpenses();
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const { username } = useExpenses();
  let firstName = username[0];
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
  const handleGroupNameChange = (e) => {
    setNewGroupName(e.target.value);
  };

  const handleEditGroup = (groupId, currentName, event) => {
    event.stopPropagation();
    setEditingGroupId(groupId);
    setNewGroupName(currentName);
  };
  const handleSaveGroupEdit = (groupId, event) => {
    event.stopPropagation();
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

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const SidebarContent = () => (
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
          onClick={isMobile ? toggleDrawer(false) : undefined}
        >
          <span className="mr-3">{item.icon}</span>
          {item.name}
        </Link>
      ))}
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
                      onChange={handleGroupNameChange}
                      className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                    <button
                      onClick={(e) => handleSaveGroupEdit(group.id, e)}
                      className="ml-2 text-green-500 hover:text-green-400"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="text-gray-400 hover:bg-gray-700 block py-2 px-4 text-sm rounded">
                    <Link
                      to={`/group/${encodeURIComponent(group.name)}`}
                      onClick={isMobile ? toggleDrawer(false) : undefined}
                    >
                      {group.name}
                    </Link>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden group-hover:flex items-center bg-gray-800 px-2 py-1 rounded">
                      <button
                        onClick={(e) =>
                          handleEditGroup(group.id, group.name, e)
                        }
                        className="text-blue-500 hover:text-blue-400 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => handleDeleteGroup(group.id, e)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={() => {
                setIsGroupModalOpen(true);
                if (isMobile) {
                  setDrawerOpen(false);
                }
              }}
              className="w-full text-left py-2 px-4 text-sm text-blue-400 hover:bg-gray-700 rounded"
            >
              + Add New Group
            </button>
          </div>
        )}
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {!isMobile && (
        <aside className="w-64 bg-gray-800 text-white">
          <SidebarContent />
        </aside>
      )}

      <main className="flex-1 relative overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto  sm:px-6 py-4 sm:py-8">
          <div className="flex flex-row justify-between items-center mb-4  px-4 md:px-0 ">
            <div className="wraper flex space-x-3 items-center  ">
              {isMobile && (
                <>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                    className="fixed   z-50"
                  >
                    <MdMenu fontSize={30} />
                  </IconButton>
                  <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                  >
                    <div className="w-64 h-full bg-gray-800 text-white">
                      <SidebarContent />
                    </div>
                  </Drawer>
                </>
              )}
              <h1 className="text-4xl sm:text-3xl font-bold text-gray-800 mb-1 md:mb-4 sm:mb-0">
                {title}
              </h1>
            </div>
            <button
              onClick={handleAddExpense}
              className="absolute top-20 right-4 md:right-8
                bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 w-auto"
            >
              {isMobile ? <FaPlus fontSize={25} /> : "Add New Expense"}
            </button>
            {isMobile ? (
              <FaUser fontSize={30} />
            ) : (
              firstName && (
                <div className="username capitalize font-semibold text-xl sm:text-3xl text-center sm:text-right md:mb-4">
                  Welcome {firstName}
                </div>
              )
            )}
          </div>
          <div className="mt-14">{children}</div>
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
