import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';

export default function ExamClient() {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [warnings, setWarnings] = useState(0);
  const [isTabActive, setIsTabActive] = useState(true);

  // Simulate Clock Sync (Hard Deadline Task)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSubmitted) {
        setTimeLeft(prev => Math.max(0, prev - 1));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Simulate Cheating Detection (Soft Deadline Task)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsTabActive(false);
        setWarnings(prev => prev + 1);
      } else {
        setIsTabActive(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center h-full bg-[#f5f5f5]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 text-center max-w-md"
        >
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Exam Submitted</h2>
          <p className="text-black/60 mb-6">Your answers have been securely recorded. The auto-submit unit ensured deadline compliance.</p>
          <div className="text-xs font-mono text-black/40 bg-black/5 p-2 rounded">
            Submission ID: {Math.random().toString(36).substring(7).toUpperCase()}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <header className="h-auto md:h-16 border-b border-black/10 flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6 py-4 md:py-0 bg-[#fcfcfc] gap-4 md:gap-0">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-base md:text-lg">Final Examination: RTOS</h1>
            <span className="px-2 py-0.5 bg-black/5 text-xs font-mono rounded text-black/60">ECT426</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${warnings > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            <Eye size={16} />
            <span className="text-xs font-medium">
              {warnings > 0 ? `${warnings} Warning(s)` : 'Proctoring Active'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-lg md:text-xl font-bold tabular-nums">
            <Clock size={20} className="text-black/40" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      {/* Main Exam Area */}
      <div className="flex-1 overflow-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
        {!isTabActive && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-700">
            <AlertTriangle size={20} />
            <div>
              <p className="font-bold text-sm">Focus Lost Detected</p>
              <p className="text-xs opacity-80">Please return to the exam tab immediately. This event has been logged.</p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <Question 
            number={1} 
            text="Explain the difference between Hard and Soft Real-Time Systems." 
          />
          <Question 
            number={2} 
            text="Calculate the CPU utilization for a task set with T1(2, 10), T2(3, 15)." 
          />
          <Question 
            number={3} 
            text="Describe the priority inheritance protocol and how it solves priority inversion." 
          />
        </div>

        <div className="mt-12 flex justify-end">
          <button 
            onClick={() => setIsSubmitted(true)}
            className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-black/80 transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </div>
    </div>
  );
}

function Question({ number, text }: { number: number; text: string }) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-lg flex gap-3">
        <span className="text-black/40 font-mono">Q{number}.</span>
        {text}
      </h3>
      <textarea 
        className="w-full h-32 p-4 rounded-lg border border-black/10 focus:border-black/30 focus:ring-0 resize-none bg-[#fafafa] text-sm transition-colors"
        placeholder="Type your answer here..."
      />
    </div>
  );
}
