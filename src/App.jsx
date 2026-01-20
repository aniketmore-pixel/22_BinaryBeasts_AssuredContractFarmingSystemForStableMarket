import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MarketplaceProvider } from "./contexts/MarketplaceContext";
import SmoothScroll from "./components/common/SmoothScroll";
import OfferDetails from "./pages/Offers/OfferDetails";
import CounterOffer from "./pages/counterOffer";
import BuyerContracts from "./pages/Buyer/Contracts/BuyerContracts";
import Fertilizers from "./pages/Buyer/BuyerFertilizers/Fertilizers";
import ProfilePage from "./pages/Profile/ProfilePage";
import MarketPlace from "./pages/Buyer/Marketplace/MarketPlace"

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

// Unified Dispute Page
import DisputesPage from "./pages/Disputes/DisputesPage";

// Calendar Page
import ContractCalendar from "./pages/Calendar/ContractCalendar";
import PaymentsPage from "./pages/Payments/PaymentsPage";
import FindOffers from "./pages/Offers/FindOffers";
import CreateOffer from "./pages/Buyer/Offers/CreateOffer";
import ContractsPage from "./pages/Contracts/ContractsPage";

import MarketTrendsPage from "./pages/Market/MarketTrendsPage";
import FarmerDisputes from "./pages/Farmer/FarmerDisputes";
import DisputeListView from "./pages/Disputes/DisputeListView";
import BuyerProfile from "./pages/Buyer/Profile/BuyerProfile";
import FertilizerResult from "./pages/Buyer/BuyerFertilizers/FertilizerResult";
import GoogleTranslate from "./components/GoogleTranslate";
import FarmerContracts from "./pages/Farmer/FarmerContracts/FarmerContracts";
import DeliveryTracking from "./pages/Buyer/DeliveryTracking/DeliveryTracking";


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
    return <Navigate to={`/${role?.toLowerCase()}`} replace />;
  }

  return children;
};

// Farmer Layout with nested routes
const FarmerRoutes = () => (
  <Layout role="farmer" title="Farmer Dashboard">
    <Outlet />
  </Layout>
);

// Buyer Layout with nested routes
const BuyerRoutes = () => (
  <Layout role="buyer" title="Corporate Dashboard">
    <Outlet />
  </Layout>
);

// Admin Layout with nested routes
const AdminRoutes = () => (
  <Layout role="admin" title="Admin Portal">
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
        <Route path="/offers/:offerId" element={<OfferDetails />} />
        <Route
          path="/offers/:offerId/counter"
          element={<CounterOffer />}
        />
        

        {/* Farmer Routes */}
        <Route path="/farmer" element={
          <ProtectedRoute allowedRoles={['farmer', 'FARMER']}>
            <FarmerRoutes />
          </ProtectedRoute>
        }>
          <Route index element={<FarmerDashboard />} />
          <Route path="contracts" element={<ContractsPage role="farmer" />} />
          <Route path="offers" element={<FindOffers />} />
          <Route path="payments" element={<PaymentsPage role="farmer" />} />
          <Route path="calendar" element={<ContractCalendar role="farmer" />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="delivery-tracking" element={<FarmerContracts />} />
          <Route path="market-trends" element={<MarketTrendsPage />} />
          

          {/* Dispute Routes */}
          <Route path="disputes" element={<FarmerDisputes role="farmer" />} />
          
          {/* <Route path="disputes/:id" element={<DisputeDetailView role="farmer" />} /> */}
        </Route>

        {/* Buyer Routes */}
        <Route path="/buyer" element={
          <ProtectedRoute allowedRoles={['buyer', 'BUYER']}>
            <BuyerRoutes />
          </ProtectedRoute>
        }>
          <Route path="contracts" element={<BuyerContracts />} />
          <Route path="marketplace" element={<MarketPlace />} />
          <Route index element={<BuyerDashboard />} />
          <Route path="create-offer" element={<CreateOffer />} />
          <Route path="contracts" element={<BuyerContracts />} />
          <Route path="fertilizer-result" element={<FertilizerResult />} />
          <Route path="fertilizer" element={<Fertilizers />} />
          <Route path="payments" element={<PaymentsPage role="buyer" />} />
          <Route path="calendar" element={<ContractCalendar role="buyer" />} />
          <Route path="profile" element= {<BuyerProfile role="buyer" />}/>
          <Route path="disputes" element={<DisputeListView role="buyer" />} />
          <Route path="delivery-tracking" element={<DeliveryTracking role="buyer" />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'ADMIN']}>
            <AdminRoutes />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="calendar" element={<ContractCalendar role="admin" />} />
          <Route path="disputes" element={<DisputesPage role="admin" />} />
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
      <MarketplaceProvider>
        <SmoothScroll>
          <Router>
          <div
              style={{
                position: "fixed",
                top: "10px",
                right: "16px",
                zIndex: 9999,
              }}
            >
              <GoogleTranslate />
            </div>

            <AnimatedRoutes />
          </Router>
        </SmoothScroll>
      </MarketplaceProvider>
    </AuthProvider>
  );
}

export default App;
