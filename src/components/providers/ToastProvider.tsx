'use client';

import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

export function ToastProvider() {
  const { toasts, removeToast } = useToast();

  return <ToastContainer toasts={toasts} onClose={removeToast} />;
}
