import './index.css'
import React from "react"
import Nav from "../../views/NavigationBar"

function Layout({ Child, hasNav }: { Child: React.ReactNode, hasNav: boolean }): React.ReactNode {
  if (!hasNav) {
    return (
      <div className="Layout">
        {Child}
      </div>
    )
  }
  return (
    <div className="Layout">
      <Nav />
      {Child}
    </div>
  )
}

export default Layout
