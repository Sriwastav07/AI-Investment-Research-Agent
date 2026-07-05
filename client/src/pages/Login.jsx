import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, Mail, Lock } from 'lucide-react';
import api from "../services/api";

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-sky rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-background" />
          </div>
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-gray-400">Login to access your research agent</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="email"
                required
                className="w-full bg-navy border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-sky/50 outline-none transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="password"
                required
                className="w-full bg-navy border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-sky/50 outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-lg">
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Don't have an account? <Link to="/register" className="text-sky hover:underline">Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
