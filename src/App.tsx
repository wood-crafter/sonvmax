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
import ManageVoucher from "./views/ManageVoucher";
import UserCart from "./views/Cart";
import { ACCOUTANT, AGENT, OWNER, SALES, STOCKER } from "./constant";
import ManageOrder from "./views/ManageOrder";
import OrderHistory from "./views/OrderHistory";
import Profile from "./views/Profile";
import ManageVolume from "./views/ManageVolume";
import { ManageCategories } from "./views/ManageCategories";
import ChangePassword from "./views/ChangePassword";
import ManageInvoice from "./views/ManageInvoice";
import Transaction from "./views/Transaction";
import TransactionHistory from "./views/TransactionHistory";
import ManageTransaction from "./views/ManageTransaction";
import ManageTicket from "./views/ManageTicket";
import Dashboard from "./views/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Layout hasNav>
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
        path="/cart"
        element={
          <Layout hasNav requiredLogin roleAllow={[AGENT.role]}>
            <UserCart />
          </Layout>
        }
      />
      <Route
        path="/transaction"
        element={
          <Layout hasNav requiredLogin>
            <Transaction />
          </Layout>
        }
      />
      <Route
        path="/transaction_history"
        element={
          <Layout hasNav requiredLogin>
            <TransactionHistory />
          </Layout>
        }
      />
      <Route
        path="/change_password"
        element={
          <Layout hasNav requiredLogin>
            <ChangePassword />
          </Layout>
        }
      />
      <Route
        path="/order/history"
        element={
          <Layout hasNav requiredLogin roleAllow={[AGENT.role]}>
            <OrderHistory />
          </Layout>
        }
      />
      <Route
        path="/forget_password"
        element={
          <Layout hasNav>
            <ForgetPassword />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout hasNav requiredLogin>
            <Profile />
          </Layout>
        }
      />
      <Route path="/manage/*">
        <Route
          path="products"
          element={
            <Layout hasNav isManager roleAllow={[OWNER.role, ACCOUTANT.role]}>
              <ManageProduct />
            </Layout>
          }
        />
        <Route
          path="orders"
          element={
            <Layout
              hasNav
              isManager
              roleAllow={[OWNER.role, ACCOUTANT.role, SALES.role]}
            >
              <ManageOrder />
            </Layout>
          }
        />
        <Route
          path="dashboard"
          element={
            <Layout hasNav isManager roleAllow={[OWNER.role, ACCOUTANT.role]}>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="agents"
          element={
            <Layout
              hasNav
              isManager
              roleAllow={[OWNER.role, ACCOUTANT.role, SALES.role]}
            >
              <ManageAgent />
            </Layout>
          }
        />
        <Route
          path="invoice"
          element={
            <Layout
              hasNav
              isManager
              roleAllow={[STOCKER.role, OWNER.role, ACCOUTANT.role]}
            >
              <ManageInvoice />
            </Layout>
          }
        />
        <Route
          path="volumes"
          element={
            <Layout hasNav isManager roleAllow={[OWNER.role]}>
              <ManageVolume />
            </Layout>
          }
        />
        <Route
          path="staff"
          element={
            <Layout hasNav isManager roleAllow={[OWNER.role]}>
              <ManageStaff />
            </Layout>
          }
        />
        <Route
          path="change_password"
          element={
            <Layout hasNav isManager>
              <ChangePassword />
            </Layout>
          }
        />
        <Route
          path="color"
          element={
            <Layout hasNav isManager roleAllow={[OWNER.role]}>
              <ManageColor />
            </Layout>
          }
        />
        <Route
          path="roles"
          element={
            <Layout hasNav isManager roleAllow={[OWNER.role]}>
              <ManageRoles />
            </Layout>
          }
        />
        <Route
          path="voucher"
          element={
            <Layout hasNav isManager roleAllow={[OWNER.role, ACCOUTANT.role]}>
              <ManageVoucher />
            </Layout>
          }
        />
        <Route
          path="transaction"
          element={
            <Layout hasNav isManager roleAllow={[OWNER.role, ACCOUTANT.role]}>
              <ManageTransaction />
            </Layout>
          }
        />
        <Route
          path="categories"
          element={
            <Layout hasNav isManager roleAllow={[OWNER.role]}>
              <ManageCategories />
            </Layout>
          }
        />
        <Route
          path="change_password"
          element={
            <Layout hasNav isManager>
              <ChangePassword />
            </Layout>
          }
        />
        <Route
          path="ticket"
          element={
            <Layout hasNav isManager roleAllow={[OWNER.role, STOCKER.role]}>
              <ManageTicket />
            </Layout>
          }
        />
        <Route
          path="profile"
          element={
            <Layout hasNav isManager requiredLogin>
              <Profile />
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
        path="/products/:categoryId"
        element={
          <Layout hasNav>
            <Products />
          </Layout>
        }
      />
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
