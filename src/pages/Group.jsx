import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useExpenses } from "../components/ExpenseContext";

const Group = () => {
  const { groupName } = useParams();
  const { groups } = useExpenses();

  const decodedGroupName = decodeURIComponent(groupName);
  const group = groups.find((g) => g.name === decodedGroupName);

  if (!group) {
    return (
      <Layout title="Group Not Found">
        <div className="text-center text-red-500">
          The requested group could not be found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Group: ${group.name}`}>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Group Members
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {group.members.map((member, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                {member}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Group;
