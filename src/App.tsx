import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import SalesLayout from './components/SalesLayout';
import AdminLogin from './components/AdminLogin';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';

const AppContent: React.FC = () => {
  const { authState } = useAuth();

  if (!authState.isAuthenticated) {
    return <AdminLogin />;
  }

  // Route based on user role
  if (authState.user?.role === 'admin' || authState.user?.role === 'manager') {
    return (
      <Routes>
        <Route path="/*" element={<AdminLayout />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/sales/*" element={<SalesLayout />} />
        <Route path="/*" element={<SalesLayout />} />
      </Routes>
    );
  }
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <div className="font-sans">
              <AppContent />
            </div>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;