'use client';

import { create } from 'zustand';
import { Toast, ToastType } from '@/components/ui/Toast';

interface ToastStore {
  toasts: Toast[];
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (type, message, duration) => {
    const id = Math.random().toString(36).substring(2, 11);
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

// Helper functions for easier usage
export const toast = {
  success: (message: string, duration?: number) => useToast.getState().addToast('success', message, duration),
  error: (message: string, duration?: number) => useToast.getState().addToast('error', message, duration),
  info: (message: string, duration?: number) => useToast.getState().addToast('info', message, duration),
  warning: (message: string, duration?: number) => useToast.getState().addToast('warning', message, duration),
};
