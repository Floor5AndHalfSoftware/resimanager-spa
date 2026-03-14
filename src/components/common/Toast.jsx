import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Toast Notification Component
 * Displays temporary notifications with AdminLTE styling
 * 
 * @param {Object} props
 * @param {string} props.message - The notification message
 * @param {string} props.type - Type of notification (success, error, warning, info)
 * @param {number} props.duration - Duration in milliseconds before auto-dismiss (default: 3000)
 * @param {function} props.onClose - Callback when toast is dismissed
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300); // Match animation duration
  };

  if (!isVisible) {
    return null;
  }

  // Map toast types to AdminLTE alert classes and icons
  const typeConfig = {
    success: {
      alertClass: 'alert-success',
      icon: 'fas fa-check-circle',
      iconColor: '#28a745'
    },
    error: {
      alertClass: 'alert-danger',
      icon: 'fas fa-times-circle',
      iconColor: '#dc3545'
    },
    warning: {
      alertClass: 'alert-warning',
      icon: 'fas fa-exclamation-triangle',
      iconColor: '#ffc107'
    },
    info: {
      alertClass: 'alert-info',
      icon: 'fas fa-info-circle',
      iconColor: '#17a2b8'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`alert ${config.alertClass} alert-dismissible shadow-sm ${isExiting ? 'toast-exit' : 'toast-enter'}`}
      role="alert"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        minWidth: '300px',
        maxWidth: '500px',
        zIndex: 9999,
        animation: isExiting ? 'slideOut 0.3s ease-out' : 'slideIn 0.3s ease-out',
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px'
      }}
    >
      <i 
        className={config.icon} 
        style={{ 
          marginRight: '12px', 
          fontSize: '20px',
          color: config.iconColor
        }}
      ></i>
      <div style={{ flex: 1, marginRight: '8px' }}>
        {message}
      </div>
      <button
        type="button"
        className="close"
        onClick={handleClose}
        aria-label="Close"
        style={{
          padding: '0',
          background: 'transparent',
          border: 'none',
          fontSize: '24px',
          fontWeight: '300',
          lineHeight: '1',
          color: '#000',
          opacity: '0.5',
          cursor: 'pointer'
        }}
      >
        <span aria-hidden="true">&times;</span>
      </button>

      {/* Inline CSS for animations */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }

        .toast-enter {
          animation: slideIn 0.3s ease-out;
        }

        .toast-exit {
          animation: slideOut 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  onClose: PropTypes.func
};

/**
 * ToastContainer Component
 * Manages multiple toast notifications
 */
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  // Expose addToast method globally
  useEffect(() => {
    window.addToast = (message, type = 'info', duration = 3000) => {
      const id = Date.now();
      const newToast = { id, message, type, duration };
      
      setToasts(prevToasts => [...prevToasts, newToast]);
    };

    return () => {
      delete window.addToast;
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 9999 }}>
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          style={{ 
            marginTop: index > 0 ? '10px' : '0' 
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

/**
 * Helper function to show toast notifications
 * Usage: showToast('Operation successful', 'success')
 */
export const showToast = (message, type = 'info', duration = 3000) => {
  if (window.addToast) {
    window.addToast(message, type, duration);
  } else {
    console.warn('ToastContainer not mounted. Toast message:', message);
  }
};

export default Toast;
