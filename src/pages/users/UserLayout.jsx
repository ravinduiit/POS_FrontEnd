import { Outlet } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import UserTopNavbar from "./UserTopNavbar";

function UserLayout() {
  return (
    <MainLayout>
      <UserTopNavbar />

      <div className="section-content">
        <Outlet />
      </div>
    </MainLayout>
  );
}

export default UserLayout;