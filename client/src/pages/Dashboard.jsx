import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, History, Star, TrendingUp, ArrowUpRight, BarChart2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';
import api from "../services/api";

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/research/history', {
          headers: { 'x-auth-token': token }
        });
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHistory();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/research?company=${searchQuery}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold mb-2"
          >
            Welcome back, {user?.name}
          </motion.h1>
          <p className="text-gray-400 text-lg">What would you like to research today?</p>
        </header>

        {/* Search Bar */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input 
              type="text"
              className="w-full bg-navy border border-white/10 rounded-2xl py-5 pl-14 pr-32 text-xl focus:ring-2 focus:ring-sky/50 outline-none transition-all shadow-2xl"
              placeholder="Enter company name (e.g. Tesla, Apple)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary py-3 px-8"
            >
              Analyze
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Research */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="text-sky w-5 h-5" />
              <h2 className="text-xl font-bold">Recent Searches</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.length > 0 ? history.map((item, i) => (
                <GlassCard 
                  key={item._id} 
                  delay={i * 0.1}
                  className="cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div onClick={() => navigate(`/report/${item.reportId}`)}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold">{item.companyName}</h3>
                      <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald text-sm">
                      <BarChart2 size={16} />
                      <span>View Report</span>
                    </div>
                  </div>
                </GlassCard>
              )) : (
                <div className="col-span-2 py-12 text-center text-gray-500 glass-card">
                  No recent searches. Start your first research above!
                </div>
              )}
            </div>
          </div>

          {/* Watchlist */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-emerald w-5 h-5" />
              <h2 className="text-xl font-bold">Watchlist</h2>
            </div>
            
            <GlassCard className="space-y-4">
              <WatchlistItem name="Tesla" price="242.60" change="+2.4%" positive />
              <WatchlistItem name="Apple" price="178.10" change="-0.8%" />
              <WatchlistItem name="NVIDIA" price="452.12" change="+4.1%" positive />
              <WatchlistItem name="Microsoft" price="330.50" change="+1.2%" positive />
              <button className="w-full py-3 border border-white/5 rounded-xl text-gray-400 hover:bg-white/5 transition-colors text-sm">
                Manage Watchlist
              </button>
            </GlassCard>
          </div>
        </div>
      </main>
    </div>
  );
};

const WatchlistItem = ({ name, price, change, positive }) => (
  <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition-colors">
    <div>
      <h4 className="font-bold">{name}</h4>
      <span className="text-sm text-gray-500">${price}</span>
    </div>
    <div className={`flex items-center gap-1 ${positive ? 'text-emerald' : 'text-red-400'}`}>
      <ArrowUpRight size={16} className={!positive && 'rotate-90'} />
      <span className="font-medium">{change}</span>
    </div>
  </div>
);

export default Dashboard;
