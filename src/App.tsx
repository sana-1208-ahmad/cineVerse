import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MovieProvider } from './context/MovieContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { TrailerModal } from './components/modals/TrailerModal';
import { MovieDetailsModal } from './components/modals/MovieDetailsModal';

// Pages
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { ProfileSelectPage } from './pages/ProfileSelectPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { ViewingPreferencesPage } from './pages/ViewingPreferencesPage';
import { ParentalControlsPage } from './pages/ParentalControlsPage';
import { AuthPage } from './pages/AuthPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/profiles';

  return (
    <div className="flex flex-col min-h-screen bg-[#131313] text-[#e5e2e1] selection:bg-[#e50914] selection:text-white">
      {!isAuthPage && <Navbar />}
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/ai-assistant" element={<AiAssistantPage />} />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profiles"
            element={
              <ProtectedRoute>
                <ProfileSelectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/account"
            element={
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/preferences"
            element={
              <ProtectedRoute>
                <ViewingPreferencesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/parental"
            element={
              <ProtectedRoute>
                <ParentalControlsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}

      {/* Global Modals */}
      <TrailerModal />
      <MovieDetailsModal />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MovieProvider>
          <AppLayout />
        </MovieProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
