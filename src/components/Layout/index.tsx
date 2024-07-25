import "./index.css";
import React from "react";
import Nav from "../../views/NavigationBar";
import { useUserStore } from "../../store/user";
import { Navigate } from "react-router-dom";
import { ADMIN_ROLES } from "../../constant";
import Footer from "../../views/Footer";

type LayoutProps = {
  children: React.ReactNode;
  hasNav?: boolean;
  isManager?: boolean;
};

function Layout({
  children,
  hasNav = false,
  isManager = false,
}: LayoutProps): React.ReactNode {
  const roleName = useUserStore((state) => state.roleName);
  if (!hasNav) {
    return (
      <div className={isManager ? "ManagerLayout" : "Layout"}>{children}</div>
    );
  }
  if (isManager && (!roleName || !ADMIN_ROLES.includes(roleName))) {
    return <Navigate to="/home" replace={true} />;
  }
  return (
    <div className={`${isManager ? "ManagerLayout" : "Layout"} Layout-wrapper`}>
      <Nav isManager={isManager} />
      <main>{children}</main>
      {!isManager && <Footer />}
    </div>
  );
}

export default Layout;
