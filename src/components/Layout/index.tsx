import './index.css'
import React from "react"
import Nav from "../../views/NavigationBar"
import { useUserStore } from '../../store/user'
import { Navigate } from 'react-router-dom'
import { ADMIN_ROLES } from '../../constant'

function Layout({ Child, hasNav, isManager }: { Child: React.ReactNode, hasNav: boolean, isManager: boolean }): React.ReactNode {
  const roleName = useUserStore((state) => state.roleName)
  if (!hasNav) {
    return (
      <div className={isManager ? "ManagerLayout" : "Layout"}>
        {Child}
      </div>
    )
  }
  if (isManager && (!roleName || !ADMIN_ROLES.includes(roleName))) {
    return (
      <Navigate to='/home' replace={true} />
    )
  }
  return (
    <div className={isManager ? "ManagerLayout" : "Layout"}>
      <Nav isManager={isManager} />
      {Child}
    </div>
  )
}

export default Layout
