import { Outlet } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import CategoryTopNavbar from "./CategoryTopNavbar";

function CategoryLayout() {
  return (
    <MainLayout>
      <CategoryTopNavbar />

      <div className="section-content">
        <Outlet />
      </div>
    </MainLayout>
  );
}

export default CategoryLayout;