import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, BarChart3, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stockData = [
  { month: "Jan", price: 120 },
  { month: "Feb", price: 135 },
  { month: "Mar", price: 128 },
  { month: "Apr", price: 150 },
  { month: "May", price: 168 },
  { month: "Jun", price: 182 },
  { month: "Jul", price: 176 },
  { month: "Aug", price: 195 },
];

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald/10 rounded-full blur-[120px]" />
      
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
              AI Investment <br />
              <span className="bg-gradient-to-r from-sky to-emerald bg-clip-text text-transparent">
                Research Agent
              </span>
            </h1>
            <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed">
              Research any company using AI, analyze financials, evaluate risks, 
              understand market sentiment, and receive intelligent investment recommendations.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn-primary text-lg">
                Start Researching
              </Link>
              <Link to="/demo" className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-lg">
                View Demo
              </Link>
            </div>
          </motion.div>

          {/* Stock Market Preview */}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-20"
          >
            <div className="glass-card max-w-5xl mx-auto p-8">

              <h2 className="text-2xl font-bold mb-8 text-center">
                AI Market Analysis Preview
              </h2>

              <div className="h-[400px]">

                <ResponsiveContainer width="100%" height="100%">

                  <LineChart data={stockData}>

                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />

                    <XAxis
                      dataKey="month"
                      stroke="#9CA3AF"
                    />

                    <YAxis
                      stroke="#9CA3AF"
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#38bdf8"
                      strokeWidth={4}
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </div>
          </motion.div>
        </div>
        </section>

      {/* Features */}
      <section className="py-20 px-6 bg-navy/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Shield className="text-sky" />}
            title="Risk Analysis"
            desc="Deep dive into debt, market, and competitor risks."
          />
          <FeatureCard 
            icon={<BarChart3 className="text-emerald" />}
            title="Live Streaming"
            desc="Watch every research step in real-time."
          />
          <FeatureCard 
            icon={<Zap className="text-sky" />}
            title="Intelligent Logic"
            desc="AI evaluates growth, profitability, and sentiment."
          />
          <FeatureCard 
            icon={<Globe className="text-emerald" />}
            title="PDF Reports"
            desc="Export professional reports with one click."
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="glass-card p-8 border-none bg-white/5">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{desc}</p>
  </div>
);

export default Landing;
