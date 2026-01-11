import { createBrowserRouter, Navigate } from "react-router-dom";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Notifications from "./pages/Notifications";
import MyTransactions from "./pages/MyTransactions";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Dashboard from "./components/Dashboard"
import { useAuth } from "./context/AuthContext";
import MyProperties from "./components/MyProperties";
import OwnerDashboard from "./pages/OwnerDashboard";
import GroupPayment from "./pages/GroupPayment";
import CreateProperty from "./pages/CreateProperty";
import Navbar from './components/Navbar';
import BuyerDashboard from "./pages/BuyerDashboard";
import PaymentPage from "./pages/PaymentPage"
import PaymentSuccess from "./pages/PaymentSuccess";
import GroupInterestPage from "./pages/GroupInterestPage";
import GroupPaymentInvitesPage from "./pages/GroupPaymentInvitesPage";
import InviteMembersPage from "./pages/InviteMembersPage";
import GroupInvitePage from "./pages/GroupInvitePage";
import WalletDashboard from "./pages/Wallet-Dashboard";
import CommitteeList from "./pages/CommitteeList";
import CommitteeDetail from "./pages/CommitteeDetail";
import MyCommittees from "./pages/MyCommittees";


/* 🔐 Protected Route */
const Protected = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Checking session...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
};

export const router = createBrowserRouter([

  
  { path: "/", element: <Properties /> },

  { path: "/login", element: <LoginForm /> },
  { path: "/register", element: <RegisterForm /> },

  {
    path: "/dashboard",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },

  {
    path: "/committees",
    element: (
      <Protected>
        <CommitteeList />
      </Protected>
    ),
  },
  {
    path: "/committees/:id",
    element: (
      <Protected>
        <CommitteeDetail />
      </Protected>
    ),
  },

  {
    path: "/my-committees",
    element: (
      <Protected>
        <MyCommittees />
      </Protected>
    ),
  },

  {
    path: "/wallet-dashboard",
    element: (
      <Protected>
        <WalletDashboard />
      </Protected>
    ),
  },

  {
    path: "/dashboard",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },

  {
    path: "/grouppayment",
    element: (
      <Protected>
        <GroupPayment />
      </Protected>
    ),
  },
  {
  path: "/group-payment-invites",
  element: (
    <Protected>
      <GroupPaymentInvitesPage />
    </Protected>
  ),
},

 {
  path: "/group-invite/:inviteId",
  element: (
    <Protected>
      <GroupInvitePage />
    </Protected>
  ),
},

  {
    path: "/ownerdashboard",
    element: (
      <Protected>
        <OwnerDashboard />
      </Protected>
    ),
  },

  {
    path: "/createproperty",
    element: (
      <Protected>
        <CreateProperty />
      </Protected>
    ),
  },


  {
    path: "/notifications",
    element: (
      <Protected>
        <Notifications />
      </Protected>
    ),
  },

  {
  path: "/group-interest/:propertyId",
  element: (
    <Protected>
      <GroupInterestPage />
    </Protected>
  ),
},


  { path: "/payment-success/:planId", element: <PaymentSuccess /> },

  {
    path: "/myproperty",
    element: (
      <Protected>
        <MyProperties />
      </Protected>
    ),
  },

  {
    path: "/buyer-dashboard",
    element: (
      <Protected>
        <BuyerDashboard />
      </Protected>
    ),
  },

  {
    path: "/payment/:planId",
    element: (
      <Protected>
        <PaymentPage />
      </Protected>
    ),
  },

{
    path: "invite-members/:planId",
    element: (
      <Protected>
        <InviteMembersPage />
      </Protected>
    ),
  },



  {
    path: "/transactions",
    element: (
      <Protected>
        <MyTransactions />
      </Protected>
    ),
  },

  { path: "/property/:id", element: <PropertyDetail /> },

  /* 🔥 Catch-all */
  { path: "*", element: <Navigate to="/" replace /> },
]);
