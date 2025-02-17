import Header from "@/components/Sections/Header";
import SubscribersTable from "@/components/Table/SubscribersTable";
import React from "react";

const SubscribersPage = () => {
  return (
    <main className="adminContainer">
      <Header title="Subscribers" />
      <SubscribersTable />
    </main>
  );
};

export default SubscribersPage;
