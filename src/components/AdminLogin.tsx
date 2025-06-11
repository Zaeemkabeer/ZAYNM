import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState<'admin' | 'sales'>('admin');
  const { authState, login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleQuickLogin = (type: 'admin' | 'sales') => {
    if (type === 'admin') {
      setEmail('admin@lead.com');
      setPassword('password');
    } else {
      setEmail('sales@lead.com');
      setPassword('sales123');
    }
    setLoginType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-5">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white text-center">
          <div className="mb-3 inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
            <div className="text-3xl font-bold">Z</div>
          </div>
          <h1 className="text-2xl font-bold">Zayn CRM</h1>
          <p className="mt-2 opacity-80">Sign in to your account</p>
        </div>
        
        <div className="p-6">
          {/* Quick Login Buttons */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Quick Login:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin('admin')}
                className="p-3 border-2 border-indigo-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
              >
                <div className="font-medium text-indigo-600">Admin Portal</div>
                <div className="text-xs text-gray-500">admin@lead.com</div>
              </button>
              <button
                onClick={() => handleQuickLogin('sales')}
                className="p-3 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center"
              >
                <div className="font-medium text-purple-600">Sales Portal</div>
                <div className="text-xs text-gray-500">sales@lead.com</div>
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign in manually</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {authState.error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {authState.error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={authState.loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-70"
            >
              {authState.loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Demo Credentials:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>Admin:</strong> admin@lead.com / password</div>
              <div><strong>Sales:</strong> sales@lead.com / sales123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;