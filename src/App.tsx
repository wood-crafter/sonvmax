import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Home from "./views/Home";
import ForgetPassword from "./views/ForgetPassword";
import Layout from "./components/Layout";
import ManageProduct from "./views/ManageProduct";
import ManageAgent from "./views/ManageAgent";
import ManageStaff from "./views/ManageStaff";
import Products from "./views/Products";
import ProductDetail from "./views/ProductDetail";
import ManageColor from "./views/ManageColor";
import { ManageRoles } from "./views/ManageRoles";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      <Route
        path="/home"
        element={
          <Layout hasNav>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/forget_password"
        element={
          <Layout>
            <ForgetPassword />
          </Layout>
        }
      />
      <Route path="/manage/*">
        <Route
          path="products"
          element={
            <Layout hasNav isManager>
              <ManageProduct />
            </Layout>
          }
        />
        <Route
          path="agents"
          element={
            <Layout hasNav isManager>
              <ManageAgent />
            </Layout>
          }
        />
        <Route
          path="staff"
          element={
            <Layout hasNav isManager>
              <ManageStaff />
            </Layout>
          }
        />
        <Route
          path="color"
          element={
            <Layout hasNav isManager>
              <ManageColor />
            </Layout>
          }
        />
        <Route
          path="roles"
          element={
            <Layout hasNav isManager>
              <ManageRoles />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout hasNav isManager>
              404 | Not Found
            </Layout>
          }
        />
      </Route>
      <Route
        path="/products"
        element={
          <Layout hasNav>
            <Products />
          </Layout>
        }
      />
      <Route
        path="/product_detail/*"
        element={
          <Layout hasNav>
            <ProductDetail />
          </Layout>
        }
      />
      <Route
        path="/*"
        element={
          <Layout hasNav>
            <Home />
          </Layout>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
