import "./index.css";
import React from "react";
import Nav from "../../views/NavigationBar";
import { useUserStore } from "../../store/user";
import { Navigate } from "react-router-dom";
import { ACCOUTANT, ADMIN_ROLES, AGENT, SALES, STOCKER } from "../../constant";
import Footer from "../../views/Footer";

type LayoutProps = {
  children: React.ReactNode;
  hasNav?: boolean;
  isManager?: boolean;
  requiredLogin?: boolean;
  roleAllow?: string[];
};

function Layout({
  children,
  hasNav = false,
  isManager = false,
  requiredLogin = false,
  roleAllow = ADMIN_ROLES,
}: LayoutProps): React.ReactNode {
  const accessToken = useUserStore((state) => state.accessToken);
  const roleName = useUserStore((state) => state.roleName);

  if (!hasNav) {
    return (
      <div className={isManager ? "ManagerLayout" : "Layout"}>{children}</div>
    );
  }
  if (isManager && (!roleName || !roleAllow.includes(roleName))) {
    if (!roleName || !ADMIN_ROLES.includes(roleName)) {
      return <Navigate to="/home" replace={true} />;
    }
    if (roleName === SALES.role) {
      return <Navigate to={SALES.defaultPath} replace={true} />;
    }
    if (roleName === STOCKER.role) {
      return <Navigate to={STOCKER.defaultPath} replace={true} />;
    }
    if (roleName === ACCOUTANT.role) {
      return <Navigate to={ACCOUTANT.defaultPath} replace={true} />;
    }
    return <Navigate to="/manage/products" replace={true} />;
  }
  if (requiredLogin && !accessToken) {
    return <Navigate to="/home" replace={true} />;
  }
  if (
    !isManager &&
    accessToken &&
    roleAllow.includes(AGENT.role) &&
    roleName !== AGENT.role
  ) {
    return <Navigate to="/home" replace={true} />;
  }
  return (
    <div className={`${isManager ? "ManagerLayout" : "Layout"} Layout-wrapper`}>
      <Nav isManager={isManager} />
      <main className={`${isManager ? "ManagerBody" : ""}`}>{children}</main>
      {!isManager && <Footer />}
    </div>
  );
}

export default Layout;
