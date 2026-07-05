import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, CheckCircle2, TrendingUp, Shield, BarChart3, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import GlassCard from '../components/GlassCard';

const Demo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-black mb-6">Product Demo</h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Experience how our AI Research Agent transforms complex market data into actionable investment intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <DemoStep 
              icon={<Play className="text-sky" />}
              title="1. Intelligent Search"
              desc="Enter any company name. Our agent automatically identifies the correct entity and industry context."
            />
            <DemoStep 
              icon={<TrendingUp className="text-emerald" />}
              title="2. Live AI Orchestration"
              desc="Watch as LangGraph coordinates multiple specialized tools to gather financials, news, and sentiment."
            />
            <DemoStep 
              icon={<BarChart3 className="text-sky" />}
              title="3. Deep Analysis"
              desc="AI evaluates revenue growth, debt-to-equity, and competitive positioning to form a thesis."
            />
            <DemoStep 
              icon={<Globe className="text-emerald" />}
              title="4. Professional Reporting"
              desc="Get a comprehensive SWOT analysis and a downloadable PDF report in seconds."
            />
          </div>

          <GlassCard className="aspect-video flex items-center justify-center bg-navy relative overflow-hidden border-sky/20">
            <div className="absolute inset-0 bg-gradient-to-br from-sky/10 to-emerald/10 animate-pulse" />
            <div className="text-center z-10 p-8">
              <div className="w-20 h-20 bg-sky/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-sky/30">
                <Play className="text-sky fill-sky" size={32} />
              </div>
              <p className="text-lg font-bold text-white mb-2">Interactive Demo Preview</p>
              <p className="text-gray-400 text-sm">Sign up to run a live analysis on any company.</p>
              <Link to="/register" className="btn-primary mt-6 inline-block">
                Get Full Access
              </Link>
            </div>
          </GlassCard>
        </div>

        <section className="text-center pt-20 border-t border-white/5">
          <h2 className="text-3xl font-bold mb-12">Ready to start your research?</h2>
          <div className="flex flex-wrap justify-center gap-6">
             <Link to="/register" className="btn-primary px-12 py-4 text-xl">
                Create Free Account
             </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

const DemoStep = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ x: 10 }}
    className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors"
  >
    <div className="mt-1">{icon}</div>
    <div>
      <h3 className="text-xl font-bold mb-1">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  </motion.div>
);

export default Demo;