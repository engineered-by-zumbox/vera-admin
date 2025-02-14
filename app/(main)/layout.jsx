import SideNav from "@/components/Navigation/SideNav";


const AdminLayout = ({ children }) => {
  return (
    <>
      <SideNav />
      <div className="ml-[320px]">{children}</div>
    </>
  );
};

export default AdminLayout;
