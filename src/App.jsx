import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./pages/landing";
import UserSignIn from "./pages/auth/userSignIn";
import ProtectedRoute from "./components/protectedRoute/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDescription from "./pages/productDescription";
import Customer from "./pages/customer";
import UserSignUp from "./pages/auth/userSignUp";
import Order from "./pages/order";
import OrderDetails from "./pages/orderDetails";
import Newsletter from "./pages/newsletter";
import Marketplace from "./pages/marketplace";
import Dashboard from "./pages/dashboard";
import Distributors from "./pages/distributors";
import ChatApp from "./pages/chatpage";
import Driver from "./pages/driver";
import { DriverDetail } from "./components/molecule/driver/driverDetail";
import Support from "./pages/support";
import NotificationPage from "./pages/notification";
import { DistributorDetail } from "./components/molecule/distributorsTable/distributorsDetail";
import GalleryPage from "./pages/GalleryPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/sign-in" element={<UserSignIn />} />
          <Route path="/sign-up" element={<UserSignUp />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Landing />} />
            <Route path="/product/:id" element={<ProductDescription />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/order" element={<Order />} />
            <Route path="/order/:orderID" element={<OrderDetails />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/distributors" element={<Distributors />} />
            <Route path="/driver" element={<Driver />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/support-message" element={<Support />} />
            <Route path="/driver/:driverId" element={<DriverDetail />} />
            <Route
              path="/distributor/:distributorId"
              element={<DistributorDetail />}
            />
            <Route path="/chat/:distributorId" element={<ChatApp />} />
             <Route path="/gallery" element={<GalleryPage />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
