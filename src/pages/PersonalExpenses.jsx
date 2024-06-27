import React from "react";
import PersonalExpensesTable from "../components/PxTabel";
import { useExpenses } from "../components/ExpenseContext";
import Layout from "../components/Layout";

const PersonalExpenses = () => {
  const { personalExpenses, groupExpenses } = useExpenses();

  if (personalExpenses.length === 0) {
    return (
      <Layout title="Personal Expenses">
        <p className="text-center text-gray-500">
          You haven't added any Personal expenses yet.
        </p>
      </Layout>
    );
  }

  return (
    <Layout title="Personal Expenses">
      <PersonalExpensesTable />
    </Layout>
  );
};

export default PersonalExpenses;
