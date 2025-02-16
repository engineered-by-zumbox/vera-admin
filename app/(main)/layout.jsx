"use client";

import SideNav from "@/components/Navigation/SideNav";
import Spinner from "@/components/Spinner";
import { useAuth } from "@/hooks/useAuth";

const AdminLayout = ({ children }) => {
  const { authenticating } = useAuth();

  if (authenticating) {
    return (
      <div className="flex justify-center min-h-[60vh] items-center mt-10">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <SideNav />
      <div className="ml-[320px]">{children}</div>
    </>
  );
};

export default AdminLayout;
