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
import ManageProduct from './views/ManageProduct'

type menuSetting = {
  path: string,
  element: React.ReactNode,
  hasNav: boolean,
  isManager: boolean,
}

const menus: menuSetting[] = [
  { path: '/login', element: <Login />, hasNav: false, isManager: false },
  { path: '/home', element: <Home />, hasNav: true, isManager: true },
  { path: '/forget_password', element: <ForgetPassword />, hasNav: false, isManager: false },
  { path: '/manage/products', element: <ManageProduct />, hasNav: true, isManager: true },
  { path: '/*', element: <Home />, hasNav: true, isManager: false },
]

const AppRoutes = () => {
  return (
    <Routes>
      {menus.map(item => {
        return <Route path={item.path} element={<Layout Child={item.element} hasNav={item.hasNav} isManager={item.isManager} />} />
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
