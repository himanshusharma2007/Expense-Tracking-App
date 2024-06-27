import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UserInfoPage from "./pages/UserInfoPage";
import Dashboard from "./pages/Dashboard";
import AllExpenses from "./pages/AllExpenses";
import PersonalExpenses from "./pages/PersonalExpenses";
import GroupExpenses from "./pages/GroupExpenses";
import Activity from "./pages/Activity";
import { ExpenseProvider } from "./components/ExpenseContext";
import Group from "./pages/Group";

const App = () => {
  return (
    <ExpenseProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="userinfo" element={<UserInfoPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="all-expenses" element={<AllExpenses />} />
            <Route path="personal-expenses" element={<PersonalExpenses />} />
            <Route path="group-expenses" element={<GroupExpenses />} />
            <Route path="activity" element={<Activity />} />
            <Route path="/group/:groupName" element={<Group />} />
          </Routes>
        </div>
      </Router>
    </ExpenseProvider>
  );
};

export default App;
