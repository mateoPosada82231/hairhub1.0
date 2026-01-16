"use client";

import toast, { Toaster } from "react-hot-toast";

// Re-export Toaster for use in layout
export { Toaster };

// Toast notification utilities
export const notify = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        background: "#1a1a1a",
        color: "#fff",
        border: "1px solid #22c55e",
      },
      iconTheme: {
        primary: "#22c55e",
        secondary: "#fff",
      },
    }),

  error: (message: string) =>
    toast.error(message, {
      style: {
        background: "#1a1a1a",
        color: "#fff",
        border: "1px solid #ef4444",
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    }),

  loading: (message: string) =>
    toast.loading(message, {
      style: {
        background: "#1a1a1a",
        color: "#fff",
        border: "1px solid #3b82f6",
      },
    }),

  info: (message: string) =>
    toast(message, {
      style: {
        background: "#1a1a1a",
        color: "#fff",
        border: "1px solid #3b82f6",
      },
      icon: "ℹ️",
    }),

  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};

// Convenience exports
export const showSuccessToast = notify.success;
export const showErrorToast = notify.error;
export const showLoadingToast = notify.loading;
export const showInfoToast = notify.info;
export const dismissToast = notify.dismiss;

export { toast };
