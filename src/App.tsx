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
import ManageAgent from './views/ManageAgent'
import ManageStaff from './views/ManageStaff'
import Products from './views/Products'
import ProductDetail from './views/ProductDetail'
import ManageColor from './views/ManageColor'

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
  { path: '/manage/agents', element: <ManageAgent />, hasNav: true, isManager: true },
  { path: '/manage/staff', element: <ManageStaff />, hasNav: true, isManager: true },
  { path: '/manage/color', element: <ManageColor />, hasNav: true, isManager: true },
  { path: '/products', element: <Products />, hasNav: true, isManager: false },
  { path: '/product_detail/*', element: <ProductDetail />, hasNav: true, isManager: false },
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
