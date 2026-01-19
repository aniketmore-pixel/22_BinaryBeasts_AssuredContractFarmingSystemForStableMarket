import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { DisputeProvider } from "./contexts/DisputeContext";
import SmoothScroll from "./components/common/SmoothScroll";

// Components
import Layout from "./components/layout/Layout";

// Pages
import LandingPage from "./pages/Landing/LandingPage";
import { Login, Signup } from "./pages/Auth/AuthPages";
import FarmerDashboard from "./pages/Farmer/FarmerDashboard";
import BuyerDashboard from "./pages/Buyer/BuyerDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import TimelineDemo from "./pages/Demo/TimelineDemo";
import InsightsDemo from "./pages/Demo/InsightsDemo";

// Dispute Pages
import DisputeListView from "./pages/Disputes/DisputeListView";
import DisputeDetailView from "./pages/Disputes/DisputeDetailView";
import NewDisputeForm from "./pages/Disputes/NewDisputeForm";
import AdminDisputeList from "./pages/Admin/AdminDisputeList";
import AdminDisputeDetail from "./pages/Admin/AdminDisputeDetail";

// Calendar Page
import ContractCalendar from "./pages/Calendar/ContractCalendar";

// Simple internal card used for stubs
const Card = ({ title, children }) => (
  <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
    <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
    {children}
  </div>
);

// Page transition wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to correct dashboard
    return <Navigate to={`/${role}`} replace />;
  }

  return children;
};

// Farmer Layout with nested routes
const FarmerRoutes = () => (
  <Layout role="FARMER" title="Farmer Dashboard">
    <Outlet />
  </Layout>
);

// Buyer Layout with nested routes
const BuyerRoutes = () => (
  <Layout role="BUYER" title="Corporate Dashboard">
    <Outlet />
  </Layout>
);

// Admin Layout with nested routes
const AdminRoutes = () => (
  <Layout role="ADMIN" title="Admin Portal">
    <Outlet />
  </Layout>
);

// App Routes
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/ui-demo/timeline" element={<PageWrapper><TimelineDemo /></PageWrapper>} />
        <Route path="/ui-demo/insights" element={<PageWrapper><InsightsDemo /></PageWrapper>} />

        {/* Farmer Routes */}
        <Route path="/FARMER" element={
          <ProtectedRoute allowedRoles={['FARMER']}>
            <FarmerRoutes />
          </ProtectedRoute>
        }>
          <Route index element={<FarmerDashboard />} />
          <Route path="contracts" element={<Card title="My Contracts">Contract list coming soon...</Card>} />
          <Route path="offers" element={<Card title="Available Offers">Browse offers coming soon...</Card>} />
          <Route path="payments" element={<Card title="Payments & Escrow">Wallet history coming soon...</Card>} />
          <Route path="calendar" element={<ContractCalendar role="FARMER" />} />
          <Route path="profile" element={<Card title="My Profile">KYC details coming soon...</Card>} />

          {/* Dispute Routes */}
          <Route path="disputes" element={<DisputeListView role="FARMER" />} />
          <Route path="disputes/new" element={<NewDisputeForm role="FARMER" />} />
          <Route path="disputes/:id" element={<DisputeDetailView role="FARMER" />} />
        </Route>

        {/* Buyer Routes */}
        <Route path="/BUYER" element={
          <ProtectedRoute allowedRoles={['BUYER']}>
            <BuyerRoutes />
          </ProtectedRoute>
        }>
          <Route index element={<BuyerDashboard />} />
          <Route path="create-offer" element={<Card title="Create New Contract Offer">Form coming soon...</Card>} />
          <Route path="contracts" element={<Card title="Procurement Tracking">Manage contracts coming soon...</Card>} />
          <Route path="payments" element={<Card title="Escrow Management">Funds control coming soon...</Card>} />
          <Route path="calendar" element={<ContractCalendar role="BUYER" />} />
          <Route path="profile" element={<Card title="Company Profile">Verification status...</Card>} />

          {/* Dispute Routes */}
          <Route path="disputes" element={<DisputeListView role="BUYER" />} />
          <Route path="disputes/new" element={<NewDisputeForm role="BUYER" />} />
          <Route path="disputes/:id" element={<DisputeDetailView role="BUYER" />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/ADMIN" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminRoutes />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="calendar" element={<ContractCalendar role="ADMIN" />} />
          {/* Dispute Routes */}
          <Route path="disputes" element={<AdminDisputeList />} />
          <Route path="disputes/:id" element={<AdminDisputeDetail />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <DisputeProvider>
        <SmoothScroll>
          <Router>
            <AnimatedRoutes />
          </Router>
        </SmoothScroll>
      </DisputeProvider>
    </AuthProvider>
  );
}

export default App;
