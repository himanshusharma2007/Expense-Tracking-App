// UserInfoPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createOrGetUser, getUserData } from "../utils/firebaseUtils";

const UserInfoPage = ({ setUsername }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingUser = async () => {
      const userId = localStorage.getItem("trackexUserId");
      if (userId) {
        const userData = await getUserData(userId);
        if (userData) {
          setUsername([userData.firstName, userData.lastName]);
          navigate("/dashboard");
        }
      }
    };

    checkExistingUser();
  }, [navigate, setUsername]);

  const handleContinue = async () => {
    if (firstName && lastName) {
      await createOrGetUser(firstName, lastName);
      setUsername([firstName, lastName]);
      navigate("/dashboard");
    } else {
      alert("Please enter both first name and last name.");
    }
  };

  return (
    <div className="min-h-screen pattern flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 border-2 border-[#27AE60]">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-6 text-center">
          Welcome to TrackEx
        </h2>

        <div className="mb-6">
          <label
            className="block text-[#34495E] text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            First Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-[#2C3E50] leading-tight focus:outline-none focus:shadow-outline"
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-[#34495E] text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-[#2C3E50] leading-tight focus:outline-none focus:shadow-outline"
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <p className="text-[#3498DB] text-sm italic mb-6">
          You will be the Financial Manager of your TrackEx account.
        </p>
        <button
          className="w-full bg-[#27AE60] hover:bg-[#2ECC71] text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default UserInfoPage;
