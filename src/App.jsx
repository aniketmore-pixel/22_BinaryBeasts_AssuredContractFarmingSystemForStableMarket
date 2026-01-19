import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { role, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their own dashboard if they try to access another role's area
    return <Navigate to={`/${role}`} replace />;
  }

  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/ui-demo/timeline" element={<PageWrapper><TimelineDemo /></PageWrapper>} />
        <Route path="/ui-demo/insights" element={<PageWrapper><InsightsDemo /></PageWrapper>} />

        {/* Farmer Routes */}
        <Route
          path="/farmer/*"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerRoutes />
            </ProtectedRoute>
          }
        />

        {/* Buyer Routes */}
        <Route
          path="/buyer/*"
          element={
            <ProtectedRoute allowedRoles={['buyer']}>
              <BuyerRoutes />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
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

const FarmerRoutes = () => (
  <Layout role="farmer" title="Farmer Dashboard">
    <Routes>
      <Route index element={<FarmerDashboard />} />
      <Route path="contracts" element={<div style={{ padding: '2rem' }}><Card title="My Contracts">Contract list coming soon...</Card></div>} />
      <Route path="offers" element={<div style={{ padding: '2rem' }}><Card title="Available Offers">Browse offers coming soon...</Card></div>} />
      <Route path="payments" element={<div style={{ padding: '2rem' }}><Card title="Payments & Escrow">Wallet history coming soon...</Card></div>} />
      <Route path="calendar" element={<ContractCalendar role="farmer" />} />
      <Route path="profile" element={<div style={{ padding: '2rem' }}><Card title="My Profile">KYC details coming soon...</Card></div>} />

      {/* Dispute Routes */}
      <Route path="disputes" element={<DisputeListView role="farmer" />} />
      <Route path="disputes/new" element={<NewDisputeForm role="farmer" />} />
      <Route path="disputes/:id" element={<DisputeDetailView role="farmer" />} />
    </Routes>
  </Layout>
);

const BuyerRoutes = () => (
  <Layout role="buyer" title="Corporate Dashboard">
    <Routes>
      <Route index element={<BuyerDashboard />} />
      <Route path="create-offer" element={<div style={{ padding: '2rem' }}><Card title="Create New Contract Offer">Form coming soon...</Card></div>} />
      <Route path="contracts" element={<div style={{ padding: '2rem' }}><Card title="Procurement Tracking">Manage contracts coming soon...</Card></div>} />
      <Route path="payments" element={<div style={{ padding: '2rem' }}><Card title="Escrow Management">Funds control coming soon...</Card></div>} />
      <Route path="calendar" element={<ContractCalendar role="buyer" />} />
      <Route path="profile" element={<div style={{ padding: '2rem' }}><Card title="Company Profile">Verification status...</Card></div>} />

      {/* Dispute Routes */}
      <Route path="disputes" element={<DisputeListView role="buyer" />} />
      <Route path="disputes/new" element={<NewDisputeForm role="buyer" />} />
      <Route path="disputes/:id" element={<DisputeDetailView role="buyer" />} />
    </Routes>
  </Layout>
);

const AdminRoutes = () => (
  <Layout role="admin" title="Admin Portal">
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="calendar" element={<ContractCalendar role="admin" />} />

      {/* Dispute Routes */}
      <Route path="disputes" element={<AdminDisputeList />} />
      <Route path="disputes/:id" element={<AdminDisputeDetail />} />
    </Routes>
  </Layout>
);

// Simple internal card used for stubs
const Card = ({ title, children }) => (
  <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
    <h3 style={{ marginBottom: '1rem' }}>{title}</h3>
    {children}
  </div>
);

export default App;
