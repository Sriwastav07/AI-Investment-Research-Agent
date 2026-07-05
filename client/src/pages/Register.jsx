import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, Mail, Lock, User } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
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
          <div className="w-12 h-12 bg-emerald rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-background" />
          </div>
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-gray-400">Join the next generation of investors</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-400 text-sm text-center">{error}</div>}
          
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="text"
                required
                className="w-full bg-navy border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald/50 outline-none transition-all"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="email"
                required
                className="w-full bg-navy border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald/50 outline-none transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input 
                type="password"
                required
                className="w-full bg-navy border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-emerald/50 outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="btn-emerald w-full py-4 text-lg mt-4">
            Get Started
          </button>
        </form>

        <p className="mt-8 text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-emerald hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
