// Toast Notification Component

import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles: Record<ToastType, { bg: string; icon: string; border: string }> = {
  success: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: '✓',
    border: 'border-green-500',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: '✕',
    border: 'border-red-500',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: '⚠',
    border: 'border-yellow-500',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'ℹ',
    border: 'border-blue-500',
  },
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const styles = toastStyles[type];

  return (
    <div
      className={`
        ${styles.bg}
        border-l-4 ${styles.border}
        rounded-lg shadow-lg p-4 mb-3
        flex items-start gap-3
        animate-slide-in-right
        max-w-md
      `}
    >
      <div
        className={`
          flex-shrink-0 w-6 h-6 rounded-full
          flex items-center justify-center
          text-white font-bold text-sm
          ${type === 'success' ? 'bg-green-500' : ''}
          ${type === 'error' ? 'bg-red-500' : ''}
          ${type === 'warning' ? 'bg-yellow-500' : ''}
          ${type === 'info' ? 'bg-blue-500' : ''}
        `}
      >
        {styles.icon}
      </div>
      <p className="flex-1 text-sm text-gray-800 dark:text-gray-200">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default Toast;

// Made with Bob