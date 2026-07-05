import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Timeline from '../components/Timeline';
import GlassCard from '../components/GlassCard';
import api from "../services/api";

const Research = () => {
  const [searchParams] = useSearchParams();
  const companyName = searchParams.get('company');
  const [status, setStatus] = useState('Initializing AI Agent...');
  const [steps, setSteps] = useState([
    { label: 'Starting AI Agent...', loading: true, completed: false },
    { label: 'Company profile research', loading: false, completed: false },
    { label: 'Financial analysis', loading: false, completed: false },
    { label: 'News and sentiment analysis', loading: false, completed: false },
    { label: 'Competitor and risk assessment', loading: false, completed: false },
    { label: 'Final recommendation', loading: false, completed: false },
  ]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!companyName) {
      navigate('/dashboard');
      return;
    }

    const token = localStorage.getItem('token');
    const url = `/api/research/stream?companyName=${encodeURIComponent(companyName)}`;
    
    const eventSource = new EventSource(`${url}&x-auth-token=${token}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Update:', data);

      if (data.error) {
        setError(data.message);
        eventSource.close();
        return;
      }

      if (data.final) {
        setSteps(prev => prev.map(s => ({ ...s, loading: false, completed: true })));
        setTimeout(() => {
          navigate(`/report/${data.reportId}`);
        }, 1500);
        eventSource.close();
        return;
      }

      setStatus(data.status);
      updateTimeline(data.status);
    };

    eventSource.onerror = (err) => {
      console.error('SSE Error:', err);
      setError('Connection to research agent lost.');
      eventSource.close();
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [companyName, navigate]);

  const updateTimeline = (currentStatus) => {
    setSteps(prev => {
      const newSteps = [...prev];
      if (currentStatus.includes('Company profile')) {
        newSteps[0].completed = true;
        newSteps[0].loading = false;
        newSteps[1].loading = true;
      } else if (currentStatus.includes('Financial analysis')) {
        newSteps[1].completed = true;
        newSteps[1].loading = false;
        newSteps[2].loading = true;
      } else if (currentStatus.includes('news analyzed') || currentStatus.includes('sentiment')) {
        newSteps[2].completed = true;
        newSteps[2].loading = false;
        newSteps[3].loading = true;
      } else if (currentStatus.includes('Competitor') || currentStatus.includes('Risk')) {
        newSteps[3].completed = true;
        newSteps[3].loading = false;
        newSteps[4].loading = true;
      } else if (currentStatus.includes('Recommendation')) {
        newSteps[4].completed = true;
        newSteps[4].loading = false;
        newSteps[5].loading = true;
      }
      return newSteps;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-12 px-6 max-w-3xl mx-auto">
        <GlassCard className="p-12 text-center mb-8">
          <div className="mb-8 relative inline-block">
            <div className="w-24 h-24 bg-sky/10 rounded-full flex items-center justify-center animate-pulse">
              <TrendingUp className="text-sky w-12 h-12" />
            </div>
            <div className="absolute inset-0 border-4 border-sky/30 border-t-sky rounded-full animate-spin" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Analyzing {companyName}</h1>
          <p className="text-gray-400 text-lg mb-8">{status}</p>

          <div className="w-full bg-navy h-2 rounded-full overflow-hidden mb-12">
            <motion.div 
              className="h-full bg-gradient-to-r from-sky to-emerald"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 30 }}
            />
          </div>

          <div className="text-left">
            <Timeline steps={steps} />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-4 bg-red-400/10 border border-red-400/20 rounded-xl flex items-center gap-3 text-red-400"
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        <p className="text-center text-gray-500 text-sm">
          Our AI is scanning millions of data points to generate your report. <br />
          This usually takes between 30-60 seconds.
        </p>
      </main>
    </div>
  );
};

export default Research;
