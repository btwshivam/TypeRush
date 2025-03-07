import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

// Create context
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map(toast => (
            <Toast 
              key={toast.id} 
              toast={toast} 
              onClose={() => removeToast(toast.id)} 
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ toast, onClose }) => {
  const { id, message, type } = toast;
  
  const icons = {
    success: <FaCheckCircle className="text-green-500 text-lg" />,
    info: <FaInfoCircle className="text-blue-500 text-lg" />,
    error: <FaExclamationTriangle className="text-red-500 text-lg" />,
    warning: <FaExclamationTriangle className="text-yellow-500 text-lg" />
  };
  
  const backgrounds = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`max-w-md w-full p-4 rounded-lg shadow-lg border ${backgrounds[type] || backgrounds.info}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {icons[type] || icons.info}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <FaTimes />
        </button>
      </div>
    </motion.div>
  );
};

export default ToastProvider; 