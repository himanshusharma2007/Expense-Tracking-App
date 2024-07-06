import React from "react";
import GroupExpensesTable from "../components/GxTable";
import { useExpenses } from "../components/ExpenseContext";
import Layout from "../components/Layout";

const GroupExpenses = () => {
  const { groupExpenses } = useExpenses();

  if (groupExpenses.length === 0) {
    return (
      <Layout title="Group Expenses">
        <p className="text-center text-gray-500">
          You haven't added any Group expenses yet.
        </p>
      </Layout>
    );
  }

  return (
    <Layout title="Group Expenses">
      <GroupExpensesTable />
    </Layout>
  );
};

export default GroupExpenses;
