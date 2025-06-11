import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SalesSidebar from './SalesSidebar';
import { useAuth } from '../context/AuthContext';
import SalesDashboard from '../pages/sales/SalesDashboard';
import SalesLeads from '../pages/sales/SalesLeads';
import SalesProfile from '../pages/sales/SalesProfile';
import SalesTargets from '../pages/sales/SalesTargets';
import SalesReports from '../pages/sales/SalesReports';
import SalesCalendar from '../pages/sales/SalesCalendar';

const SalesLayout: React.FC = () => {
  const location = useLocation();
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  // Extract current page from URL
  const currentPath = location.pathname.split('/').pop() || 'dashboard';
  const [activePage, setActivePage] = useState(currentPath === 'sales' ? 'dashboard' : currentPath);
  
  const handleNavigate = (page: string) => {
    setActivePage(page);
    if (page === 'dashboard') {
      navigate('/sales');
    } else {
      navigate(`/sales/${page}`);
    }
  };
  
  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Sales Dashboard';
      case 'leads':
        return 'My Leads';
      case 'profile':
        return 'My Profile';
      case 'targets':
        return 'Sales Targets';
      case 'reports':
        return 'My Reports';
      case 'calendar':
        return 'Calendar & Tasks';
      default:
        return 'Sales Dashboard';
    }
  };

  const getPageDescription = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Overview of your sales performance and activities';
      case 'leads':
        return 'Manage and track your assigned leads';
      case 'profile':
        return 'View and edit your profile information';
      case 'targets':
        return 'Track your progress towards sales goals';
      case 'reports':
        return 'Detailed analytics and performance reports';
      case 'calendar':
        return 'Manage your schedule and daily tasks';
      default:
        return 'Sales portal overview';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <SalesSidebar activePage={activePage} onNavigate={handleNavigate} />
      
      <div className="flex-1 ml-[250px]">
        <div className="bg-white/95 backdrop-blur-sm rounded-tl-3xl m-5 shadow-xl overflow-hidden">
          <header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-5 flex justify-between items-center shadow-md">
            <div>
              <h1 className="text-2xl font-light">{getPageTitle()}</h1>
              <p className="text-sm opacity-80 mt-1">{getPageDescription()}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-medium">{authState.user?.name}</div>
                <div className="text-sm opacity-80">Sales Representative</div>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-semibold">
                {authState.user?.name.charAt(0)}
              </div>
            </div>
          </header>
          
          <main className="p-8 min-h-[calc(100vh-7rem)] overflow-y-auto">
            <Routes>
              <Route path="/" element={<SalesDashboard />} />
              <Route path="/leads" element={<SalesLeads />} />
              <Route path="/profile" element={<SalesProfile />} />
              <Route path="/targets" element={<SalesTargets />} />
              <Route path="/reports" element={<SalesReports />} />
              <Route path="/calendar" element={<SalesCalendar />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SalesLayout;