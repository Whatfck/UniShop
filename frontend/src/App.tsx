import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useThemeStore } from './stores/theme';
import { useAuthStore } from './stores/auth';
import AuthProvider from './components/auth/AuthProvider';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import DashboardPage from './pages/DashboardPage';
import SellProductPage from './pages/SellProductPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { updateResolvedTheme } = useThemeStore();
  const { isAuthenticated } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Initialize theme on app start
  useEffect(() => {
    updateResolvedTheme();
  }, [updateResolvedTheme]);

  return (
    <AuthProvider>
      <Router>
        <Layout
          onLoginClick={() => setShowLoginModal(true)}
          onRegisterClick={() => setShowRegisterModal(true)}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            {isAuthenticated && (
              <>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/sell" element={<SellProductPage />} />
              </>
            )}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>

        {/* Auth Modals */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />

        <RegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
