import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
    
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  // Icon mapping for premium theme
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-4 h-4 text-[#C8A45D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-[#e05656]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4 text-[#dfb86c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01" />
          </svg>
        );
    }
  };

  const getBackgroundAndBorder = (type) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-[#0d0903]/98 to-[#020202]/98 border-[#C8A45D]/30 shadow-[0_4px_30px_rgba(200,164,93,0.12),_inset_0_0_8px_rgba(200,164,93,0.02)]';
      case 'error':
        return 'bg-gradient-to-r from-[#140606]/98 to-[#020202]/98 border-red-950/60 shadow-[0_4px_30px_rgba(224,86,86,0.12),_inset_0_0_8px_rgba(224,86,86,0.02)]';
      case 'warning':
        return 'bg-gradient-to-r from-[#120a03]/98 to-[#020202]/98 border-amber-950/60 shadow-[0_4px_30px_rgba(223,184,108,0.08),_inset_0_0_8px_rgba(223,184,108,0.02)]';
      default:
        return 'bg-[#050505]/98 border-zinc-900 shadow-[0_4px_25px_rgba(0,0,0,0.85)]';
    }
  };

  const getTitleColor = (type) => {
    switch (type) {
      case 'success': return 'text-[#C8A45D]';
      case 'error': return 'text-[#e05656]';
      case 'warning': return 'text-[#dfb86c]';
      default: return 'text-zinc-500';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3.5 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-start gap-3 border p-4 rounded-xl transition-all ${getBackgroundAndBorder(toast.type)}`}
            >
              <div className="shrink-0 mt-0.5 w-6 h-6 rounded bg-zinc-950/80 border border-zinc-900/60 flex items-center justify-center">
                {getIcon(toast.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1 select-none">
                  <span className={`text-[9px] font-mono font-bold tracking-[0.2em] uppercase ${getTitleColor(toast.type)}`}>
                    {toast.type === 'info' ? 'System Action' : `System ${toast.type}`}
                  </span>
                  <div className="flex-1 h-[1px] bg-zinc-900/40" />
                </div>
                <p className="font-sans text-xs font-light text-zinc-300 leading-relaxed select-text">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-zinc-600 hover:text-zinc-400 transition-colors focus:outline-none cursor-pointer mt-0.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

