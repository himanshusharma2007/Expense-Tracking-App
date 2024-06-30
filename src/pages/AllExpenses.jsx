import React from "react";
import PersonalExpensesTable from "../components/PxTabel";
import GroupExpensesTable from "../components/GxTable";
import { useExpenses } from "../components/ExpenseContext";
import Layout from "../components/Layout";

const AllExpensesPage = () => {
  const { personalExpenses, groupExpenses } = useExpenses();

  if (personalExpenses.length === 0 && groupExpenses.length === 0) {
    return (
      <Layout title="All Expenses">
        <p className="text-center text-gray-500">
          You haven't added any expenses yet.
        </p>
      </Layout>
    );
  }

  return (
    <Layout title="All Expenses">
      <PersonalExpensesTable pheading/>
      <GroupExpensesTable gheading />
    </Layout>
  );
};

export default AllExpensesPage;
