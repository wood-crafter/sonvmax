import "./index.css";
import React, { useEffect } from "react";
import Nav from "../../views/NavigationBar";
import { useUserStore } from "../../store/user";
import { Navigate } from "react-router-dom";
import { ADMIN_ROLES, SALES } from "../../constant";
import Footer from "../../views/Footer";
import { useMeMutation } from "../../hooks/useMe";

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
  const { trigger: triggerMe } = useMeMutation();
  const setUserInformation = useUserStore((state) => state.setUserInformation);

  useEffect(() => {
    const triggerPersonalInfo = async () => {
      const me = await triggerMe();
      setUserInformation(me);
    };

    if (accessToken) {
      const intervalId = setInterval(triggerPersonalInfo, 2000);

      return () => clearInterval(intervalId);
    }
  }, [accessToken, setUserInformation, triggerMe]);

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
    return <Navigate to="/manage/products" replace={true} />;
  }
  if (requiredLogin && !accessToken) {
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
