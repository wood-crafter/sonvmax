import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import Login from './views/Login'
import Home from './views/Home'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={(
        <Login />
        )} />
      <Route path="/home" element={(
        <Home />
        )} />
      <Route path="/*" element={<Home />} />
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
