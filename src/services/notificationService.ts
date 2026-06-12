import toast from 'react-hot-toast';
import type { NotificationType } from '../types';

const defaultDuration = 4000;

const toastStyles = {
  style: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '14px',
    borderRadius: '10px',
    padding: '12px 16px',
  },
};

export const notificationService = {
  success(message: string, duration = defaultDuration) {
    toast.success(message, { ...toastStyles, duration });
  },

  error(message: string, duration = 5000) {
    toast.error(message, { ...toastStyles, duration });
  },

  warning(message: string, duration = defaultDuration) {
    toast(message, {
      ...toastStyles,
      duration,
      icon: '⚠️',
    });
  },

  info(message: string, duration = defaultDuration) {
    toast(message, {
      ...toastStyles,
      duration,
      icon: 'ℹ️',
    });
  },

  /**
   * Show notification based on type.
   */
  show(type: NotificationType, message: string, duration?: number) {
    switch (type) {
      case 'success':
        return this.success(message, duration);
      case 'error':
        return this.error(message, duration);
      case 'warning':
        return this.warning(message, duration);
      case 'info':
        return this.info(message, duration);
    }
  },

  dismiss() {
    toast.dismiss();
  },
};
