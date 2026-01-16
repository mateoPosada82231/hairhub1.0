import toast, { Toaster as HotToaster } from 'react-hot-toast';

// Toast configuration component
export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '12px 16px',
        },
        // Specific options for success toasts
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
          style: {
            borderColor: '#22c55e33',
          },
        },
        // Specific options for error toasts
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            borderColor: '#ef444433',
          },
        },
      }}
    />
  );
}

// Toast utility functions
export const notify = {
  success: (message: string) => {
    toast.success(message);
  },
  
  error: (message: string) => {
    toast.error(message);
  },
  
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        borderColor: '#3b82f633',
      },
    });
  },
  
  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        borderColor: '#3b82f633',
      },
    });
  },
  
  warning: (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        borderColor: '#eab30833',
      },
    });
  },
  
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
  
  dismissAll: () => {
    toast.dismiss();
  },
  
  // Promise-based toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },
};

export { toast };
