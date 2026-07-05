import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, CircleDashed, Loader2 } from 'lucide-react';

const Timeline = ({ steps }) => {
  return (
    <div className="space-y-6">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4"
        >
          <div className="relative">
            {step.completed ? (
              <CheckCircle2 className="text-emerald w-6 h-6" />
            ) : step.loading ? (
              <Loader2 className="text-sky w-6 h-6 animate-spin" />
            ) : (
              <CircleDashed className="text-gray-600 w-6 h-6" />
            )}
            {index !== steps.length - 1 && (
              <div className={`absolute top-6 left-3 w-0.5 h-6 ${step.completed ? 'bg-emerald' : 'bg-gray-700'}`} />
            )}
          </div>
          <div>
            <p className={step.completed ? 'text-white font-medium' : 'text-gray-500'}>
              {step.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
