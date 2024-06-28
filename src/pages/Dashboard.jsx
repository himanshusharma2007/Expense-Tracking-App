import React from "react";
import Layout from "../components/Layout";

const Dashboard = ({username}) => {
  return (
    <Layout title="Dashboard" firstname={username[0]}>
      <div>this is dashboard</div>
    </Layout>
  );
};

export default Dashboard;
