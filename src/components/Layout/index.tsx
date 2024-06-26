import './index.css'
import React from "react"
import Nav from "../../views/NavigationBar"

function Layout({ Child, hasNav, isManager }: { Child: React.ReactNode, hasNav: boolean, isManager: boolean }): React.ReactNode {
  if (!hasNav) {
    return (
      <div className={isManager ? "ManagerLayout" : "Layout"}>
        {Child}
      </div>
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
