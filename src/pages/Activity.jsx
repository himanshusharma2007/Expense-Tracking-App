import React from "react";
import Layout from "../components/Layout";
import { useExpenses } from "../components/ExpenseContext";
import { FaMoneyBillWave, FaUsers } from "react-icons/fa";

const ActivityItem = ({ icon, content, timestamp, type }) => {
  const getColorClass = () => {
    switch (type) {
      case "add":
        return "text-green-600";
      case "delete":
        return "text-red-600";
      case "edit":
        return "text-yellow-600";
      case "group":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
      <div className={`mr-4 ${getColorClass()}`}>{icon}</div>
      <div className="flex-grow">
        <p className="text-sm font-medium text-gray-900">{content}</p>
        <p className="text-xs text-gray-500">{timestamp}</p>
      </div>
    </div>
  );
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return `${days[date.getDay()]} at ${date.toLocaleTimeString()}`;
  } else {
    return date.toLocaleString();
  }
};

const Activity = () => {
  const { personalExpenses, groupExpenses, groups } = useExpenses();
  const Empty = () => {
    if (
      personalExpenses.length === 0 &&
      groupExpenses.length === 0 &&
      groups.length === 0
    ) {
      return (
        <p className="text-center text-gray-500">
          You haven't added any expenses yet.
        </p>
      );
    }
  };
  // Combine and sort all activities
  const allActivities = [
    ...personalExpenses.map((e) => ({ ...e, type: "personal" })),
    ...groupExpenses.map((e) => ({ ...e, type: "group" })),
    ...groups.map((g) => ({ ...g, type: "group_creation" })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <Layout title="Activity">
      <Empty />
      <div className="max-w-3xl mx-4 md:mx-auto  shadow-lg rounded-lg overflow-hidden ">
        <div className="divide-y divide-gray-200">
          {allActivities.map((activity, index) => {
            let icon, content, type;
            switch (activity.type) {
              case "personal":
                icon = <FaMoneyBillWave size={20} />;
                content = `Personal expense: - ₹${activity.value}`;
                type = "add";
                break;
              case "group":
                icon = <FaUsers size={20} />;
                content = `Group expense in ${activity.group}: - ₹${activity.value}`;
                type = "add";
                break;
              case "group_creation":
                icon = <FaUsers size={20} />;
                content = `New group created: ${activity.name}`;
                type = "group";
                break;
              default:
                icon = <FaMoneyBillWave size={20} />;
                content = "Unknown activity";
                type = "add";
            }
            return (
              <ActivityItem
                key={index}
                icon={icon}
                content={content}
                timestamp={formatTimestamp(activity.timestamp)}
                type={type}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Activity;
