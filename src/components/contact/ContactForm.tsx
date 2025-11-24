'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2, Info, User, Mail, FileText, MessageSquare, X, Check, AlertCircle, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useTranslations } from 'next-intl';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FieldError {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const STORAGE_KEY = 'contact_form_draft';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const { executeRecaptcha } = useGoogleReCaptcha();

  // Get translated subject suggestions
  const SUBJECT_SUGGESTIONS = [
    t('subjects.collaboration'),
    t('subjects.inquiry'),
    t('subjects.job'),
    t('subjects.technical'),
  ];
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [countdown, setCountdown] = useState(10);

  // Load draft from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        setFormData(draft);
      } catch (e) {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isSuccess && (formData.name || formData.email || formData.subject || formData.message)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData, isSuccess]);

  // Success countdown timer
  useEffect(() => {
    if (isSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isSuccess && countdown === 0) {
      setIsSuccess(false);
      setCountdown(10);
    }
  }, [isSuccess, countdown]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSuccess && (formData.name || formData.email || formData.subject || formData.message)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, isSuccess]);

  // Real-time validation
  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > 100) return 'Name is too long';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        return undefined;

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
        if (value.includes('gmial.com')) return 'Did you mean gmail.com?';
        return undefined;

      case 'subject':
        if (!value.trim()) return 'Subject is required';
        if (value.length < 5) return 'Subject must be at least 5 characters';
        if (value.length > 200) return 'Subject is too long';
        return undefined;

      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.length < 10) return 'Message must be at least 10 characters';
        if (value.length > 2000) return 'Message is too long';
        if (/(.)\1{10,}/.test(value)) return 'Message contains suspicious repetitive characters';
        return undefined;

      default:
        return undefined;
    }
  }, []);

  // Update field errors when data changes
  useEffect(() => {
    const errors: FieldError = {};
    Object.keys(formData).forEach((key) => {
      if (touchedFields.has(key)) {
        const error = validateField(key, formData[key as keyof FormData]);
        if (error) {
          errors[key as keyof FieldError] = error;
        }
      }
    });
    setFieldErrors(errors);
  }, [formData, touchedFields, validateField]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouchedFields(new Set(touchedFields).add(e.target.name));
  };

  const handleSubjectSelect = (subject: string) => {
    setFormData({ ...formData, subject });
    setTouchedFields(new Set(touchedFields).add('subject'));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouchedFields(new Set(['name', 'email', 'subject', 'message']));

    // Validate all fields
    const errors: FieldError = {};
    let hasErrors = false;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        errors[key as keyof FieldError] = error;
        hasErrors = true;
      }
    });

    setFieldErrors(errors);

    if (hasErrors) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Execute reCAPTCHA
      if (!executeRecaptcha) {
        setError('reCAPTCHA not ready. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const recaptchaToken = await executeRecaptcha('contact_form');

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTouchedFields(new Set());
        setFieldErrors({});
        localStorage.removeItem(STORAGE_KEY);
        setCountdown(10);
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const form = document.getElementById('contact-form') as HTMLFormElement;
        form?.requestSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getFieldStatus = (fieldName: keyof FormData) => {
    if (!touchedFields.has(fieldName)) return 'default';
    if (fieldErrors[fieldName]) return 'error';
    if (formData[fieldName]) return 'success';
    return 'default';
  };

  const getCharacterCountColor = (current: number, min: number, max: number) => {
    if (current < min) return 'text-gray-400 dark:text-gray-500';
    if (current > max * 0.9) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-green-600 dark:text-green-500';
  };

  const getProgressPercentage = (current: number, max: number) => {
    return Math.min((current / max) * 100, 100);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Message Sent Successfully!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400 mb-8"
        >
          Thank you for reaching out! I'll get back to you within 24 hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
        >
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">What happens next?</h3>
          <div className="space-y-3 text-left max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">You'll receive a confirmation email shortly</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">2</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">I'll review your message and prepare a response</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">3</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expect a reply within 24 hours during weekdays</p>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-500 dark:text-gray-500 mb-6"
        >
          Auto-closing in {countdown} seconds...
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => {
            setIsSuccess(false);
            setCountdown(10);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Send Another Message
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Form Header with Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Send me a message</h3>
        <div className="group relative">
          <button
            type="button"
            className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-help"
            aria-label="Response time information"
          >
            <Info className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="absolute right-0 top-full mt-2 w-56 p-3 bg-gray-900 dark:bg-gray-950 text-white text-xs rounded-lg shadow-xl
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10"
               role="tooltip">
            <div className="absolute -top-1.5 right-2 w-3 h-3 bg-gray-900 dark:bg-gray-950 transform rotate-45"></div>
            <p className="relative">I typically respond within ~24 hours during weekdays. Press Ctrl+Enter to submit quickly!</p>
          </div>
        </div>
      </motion.div>

      {/* Subject Quick Select */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quick select subject
        </label>
        <div className="flex flex-wrap gap-2">
          {SUBJECT_SUGGESTIONS.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              type="button"
              onClick={() => handleSubjectSelect(suggestion)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                formData.subject === suggestion
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-blue-500'
              }`}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Name Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <User className="w-5 h-5" />
          </div>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`w-full pl-11 pr-11 py-2.5 rounded-lg border transition-all
              bg-white dark:bg-gray-900 text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500/40
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${getFieldStatus('name') === 'error' ? 'border-red-500 dark:border-red-500' :
                getFieldStatus('name') === 'success' ? 'border-green-500 dark:border-green-500' :
                'border-gray-300 dark:border-gray-700'
              }`}
            placeholder="Your Name"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
          />
          {getFieldStatus('name') !== 'default' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getFieldStatus('name') === 'success' ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        <AnimatePresence>
          {fieldErrors.name && (
            <motion.p
              id="name-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {fieldErrors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Email Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            className={`w-full pl-11 pr-11 py-2.5 rounded-lg border transition-all
              bg-white dark:bg-gray-900 text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500/40
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${getFieldStatus('email') === 'error' ? 'border-red-500 dark:border-red-500' :
                getFieldStatus('email') === 'success' ? 'border-green-500 dark:border-green-500' :
                'border-gray-300 dark:border-gray-700'
              }`}
            placeholder="Input Your Email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            inputMode="email"
            autoComplete="email"
          />
          {getFieldStatus('email') !== 'default' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getFieldStatus('email') === 'success' ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        <AnimatePresence>
          {fieldErrors.email && (
            <motion.p
              id="email-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              {fieldErrors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Subject Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Subject <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FileText className="w-5 h-5" />
          </div>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            maxLength={200}
            className={`w-full pl-11 pr-11 py-2.5 rounded-lg border transition-all
              bg-white dark:bg-gray-900 text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500/40
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${getFieldStatus('subject') === 'error' ? 'border-red-500 dark:border-red-500' :
                getFieldStatus('subject') === 'success' ? 'border-green-500 dark:border-green-500' :
                'border-gray-300 dark:border-gray-700'
              }`}
            placeholder="Your Subject"
            aria-invalid={!!fieldErrors.subject}
            aria-describedby={fieldErrors.subject ? 'subject-error subject-counter' : 'subject-counter'}
          />
          {getFieldStatus('subject') !== 'default' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {getFieldStatus('subject') === 'success' ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <AnimatePresence>
            {fieldErrors.subject && (
              <motion.p
                id="subject-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {fieldErrors.subject}
              </motion.p>
            )}
          </AnimatePresence>
          <span
            id="subject-counter"
            className={`text-xs ml-auto ${getCharacterCountColor(formData.subject.length, 5, 200)}`}
            aria-live="polite"
          >
            {formData.subject.length}/200
          </span>
        </div>
        {/* Progress Bar */}
        <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage(formData.subject.length, 200)}%` }}
            className={`h-full transition-colors ${
              formData.subject.length < 5 ? 'bg-gray-400' :
              formData.subject.length > 180 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
          />
        </div>
      </motion.div>

      {/* Message Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-3 text-gray-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
            rows={5}
            maxLength={2000}
            className={`w-full pl-11 pr-4 py-2.5 rounded-lg border transition-all
              bg-white dark:bg-gray-900 text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500/40
              resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${getFieldStatus('message') === 'error' ? 'border-red-500 dark:border-red-500' :
                getFieldStatus('message') === 'success' ? 'border-green-500 dark:border-green-500' :
                'border-gray-300 dark:border-gray-700'
              }`}
            placeholder="Your Message"
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? 'message-error message-counter' : 'message-counter'}
          />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <AnimatePresence>
            {fieldErrors.message && (
              <motion.p
                id="message-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {fieldErrors.message}
              </motion.p>
            )}
          </AnimatePresence>
          <span
            id="message-counter"
            className={`text-xs ml-auto ${getCharacterCountColor(formData.message.length, 10, 2000)}`}
            aria-live="polite"
          >
            {formData.message.length}/2000
          </span>
        </div>
        {/* Progress Bar */}
        <div className="mt-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage(formData.message.length, 2000)}%` }}
            className={`h-full transition-colors ${
              formData.message.length < 10 ? 'bg-gray-400' :
              formData.message.length > 1800 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
          />
        </div>
      </motion.div>

      {/* Global Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            role="alert"
          >
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        className="w-full py-3 px-4 rounded-lg font-medium text-white
          bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
          dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800
          flex items-center justify-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200 shadow-lg shadow-blue-500/30"
        aria-live="polite"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </motion.button>

      <div className="space-y-2">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-center text-gray-500 dark:text-gray-500"
        >
          Your information is secure and will never be shared with third parties.
        </motion.p>

        {executeRecaptcha && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center justify-center gap-1.5 text-xs text-gray-400 dark:text-gray-600"
          >
            <Shield className="w-3 h-3" />
            <span>Protected by reCAPTCHA</span>
          </motion.div>
        )}
      </div>
    </form>
  );
}
