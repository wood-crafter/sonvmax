import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Login from './views/Login'
import Home from './views/Home'
import ForgetPassword from './views/ForgetPassword'
import Layout from './components/Layout'

type menuSetting = {
  path: string,
  element: React.ReactNode,
  hasNav: boolean,
}

const menus: menuSetting[] = [
  { path: '/login', element: <Login />, hasNav: false },
  { path: '/home', element: <Home />, hasNav: true },
  { path: '/forget_password', element: <ForgetPassword />, hasNav: false },
  { path: '/*', element: <Home />, hasNav: true },
]

const AppRoutes = () => {
  return (
    <Routes>
      {menus.map(item => {
        return <Route path={item.path} element={<Layout Child={item.element} hasNav={item.hasNav} />} />
      })}
    </Routes>
  )
}



function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
