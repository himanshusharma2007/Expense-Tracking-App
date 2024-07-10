import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

import { HiMenuAlt2 } from "react-icons/hi";

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
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const { username } = useExpenses();
  const [userModal, setUserModal] = useState(false);
  let firstName = username[0];
  const userModalRef = useRef(null);
  const navigate = useNavigate();
  const {
    groups,
    setGroups,
    setGroupExpenses,
    groupExpenses,
    
  } = useExpenses();

 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userModalRef.current &&
        !userModalRef.current.contains(event.target)
      ) {
        setUserModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    if (
      window.confirm(
        "Are you sure you want to log out? All your data will be erased forever."
      )
    ) {
      localStorage.removeItem("trackexUserId");
      navigate("/");
    }
  };

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
      const group = groups.find((group) => group.id === groupId);

      setGroups(updatedGroups);
      const updatedGroupExpense = groupExpenses.filter(
        (expense) => expense.group !== group.name
      );
      setGroupExpenses(updatedGroupExpense || groupExpenses);
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
  const UserModal = () => {
    return (
      <div
        ref={userModalRef}
        className="absolute w-64 bg-white top-12 md:top-14 right-0 rounded-lg shadow-lg z-50"
      >
        <div className="p-4 border-b">
          <h3 className="text-lg capitalize font-semibold text-gray-800">
            {username[0]} {username[1]}{" "}
          </h3>
        </div>
        <ul className="py-2">
          <li className="px-4 py-2 text-sm text-gray-700">
            Your TrackEx account will be specific to your Browser and Device.
          </li>
          <li className="px-4 py-2">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded transition duration-300 ease-in-out"
            >
              Log out
            </button>
          </li>
        </ul>
      </div>
    );
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
                      <button className="w-full  text-left">
                        {group.name}
                      </button>
                    </Link>
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden group-hover:flex items-center px-2 py-1 rounded ">
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
          <div className="relative flex flex-row justify-between items-center mb-4  px-4 md:px-0 ">
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
                    <HiMenuAlt2 fontSize={30} />
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 md:mb-4 sm:mb-0">
                {title}
              </h1>
            </div>
            <button
              onClick={handleAddExpense}
              className="absolute top-14 right-4 md:right-0
                bg-zinc-600 hover:bg-zinc-800 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 w-auto"
            >
              Add New Expense
            </button>
            <div className="user flex flex-row-reverse  items-center justify-center relative  ">
              <button onClick={() => setUserModal(!userModal)}>
                <FaUser fontSize={25} className="mb-3 ml-4" />
              </button>
              {userModal && <UserModal />}
              {firstName && !isMobile ? (
                <div className="username capitalize font-semibold text-xl sm:text-3xl text-center sm:text-right md:mb-4">
                  Welcome {firstName}
                </div>
              ) : (
                ""
              )}
            </div>
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
