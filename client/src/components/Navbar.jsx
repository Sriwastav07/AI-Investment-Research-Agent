import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, LayoutDashboard, TrendingUp } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 backdrop-blur-md bg-background/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-sky to-emerald rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <TrendingUp className="text-background" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            InvestAI
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 flex items-center gap-2 transition-colors"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="btn-primary py-2 px-6">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
