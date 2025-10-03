import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CartProvider } from './context/CartContext';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';
import ProductManagement from './pages/admin/ProductManagement';
import UserOrders from './pages/UserOrders';
import UserProfile from './pages/UserProfile';
import WishlistPage from './pages/WishlistPage';
import SettingsPage from './pages/SettingsPage';
import CategoriesPage from './pages/CategoriesPage';
import SupportPage from './pages/SupportPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProtectedAdminRoute from './components/AdminProtectedRoute';
import './styles/globalStyles.css';

// Wrap pages that need the main customer layout
const WithLayout = ({ children }) => (
  <Layout>
    {children}
  </Layout>
);

// Wrap admin pages with AdminLayout
const WithAdminLayout = ({ children }) => (
  <AdminLayout>
    {children}
  </AdminLayout>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected customer routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <WithLayout><DashboardPage /></WithLayout>
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute>
                  <WithLayout><ProductsPage /></WithLayout>
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <WithLayout><CartPage /></WithLayout>
                </ProtectedRoute>
              } />
              <Route path="/" element={
                <ProtectedRoute>
                  <WithLayout><ProductsPage /></WithLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <WithLayout><UserProfile /></WithLayout>
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <WithLayout><WishlistPage /></WithLayout>
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <WithLayout><CheckoutPage /></WithLayout>
                </ProtectedRoute>
              } />
              <Route path="/my-orders" element={
                <ProtectedRoute>
                  <WithLayout><UserOrders /></WithLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <WithLayout><SettingsPage /></WithLayout>
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute>
                  <WithLayout><SupportPage /></WithLayout>
                </ProtectedRoute>
              } />
        
              <Route path="/categories" element={
                <ProtectedRoute>
                  <WithLayout><CategoriesPage /></WithLayout>
                </ProtectedRoute>
              } />
              
              {/* Public order confirmation page */}
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/order-success" element={
                <ProtectedRoute>
                  <WithLayout><OrderSuccessPage /></WithLayout>
                </ProtectedRoute>
              } />
              
              {/* Protected admin routes */}
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <WithAdminLayout><AdminDashboard /></WithAdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <AdminProtectedRoute>
                  <WithAdminLayout><UserManagement /></WithAdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminProtectedRoute>
                  <WithAdminLayout><OrderManagement /></WithAdminLayout>
                </AdminProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <AdminProtectedRoute>
                  <WithAdminLayout><ProductManagement /></WithAdminLayout>
                </AdminProtectedRoute>
              } />

              <Route path="/product/:id" element={
                <ProtectedRoute>
                  <WithLayout><ProductDetailPage /></WithLayout>
                </ProtectedRoute>
              } />
              
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;