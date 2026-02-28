import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const normalizeDuration = useCallback((type, durationOrOptions) => {
    const rawDuration =
      typeof durationOrOptions === "number"
        ? durationOrOptions
        : durationOrOptions && typeof durationOrOptions.duration === "number"
          ? durationOrOptions.duration
          : undefined;

    const defaultDuration = type === "error" || type === "info" ? 1500 : 2000;
    const parsedDuration = Number.isFinite(rawDuration)
      ? rawDuration
      : defaultDuration;

    // Per request: toast info/error hanya 1-2 detik.
    if (type === "error" || type === "info") {
      return Math.min(2000, Math.max(1000, parsedDuration));
    }

    return parsedDuration;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info", durationOrOptions) => {
    const duration = normalizeDuration(type, durationOrOptions);
    const id = Date.now();
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [normalizeDuration, removeToast]);

  const toast = {
    success: (message, durationOrOptions) =>
      addToast(message, "success", durationOrOptions),
    error: (message, durationOrOptions) =>
      addToast(message, "error", durationOrOptions),
    warning: (message, durationOrOptions) =>
      addToast(message, "warning", durationOrOptions),
    info: (message, durationOrOptions) =>
      addToast(message, "info", durationOrOptions),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual Toast
const Toast = ({ toast, onClose }) => {
  const { type, message } = toast;

  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400",
      textColor: "text-green-900 dark:text-green-100",
    },
    error: {
      icon: XCircle,
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800",
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-900 dark:text-red-100",
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      textColor: "text-yellow-900 dark:text-yellow-100",
    },
    info: {
      icon: Info,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
      textColor: "text-blue-900 dark:text-blue-100",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        border-2 rounded-xl shadow-lg p-4 min-w-[320px] max-w-md
        pointer-events-auto backdrop-blur-sm
      `}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
        <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default ToastProvider;
