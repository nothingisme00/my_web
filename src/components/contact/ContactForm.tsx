'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, Mail, User, FileText, MessageSquare, Info } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setError(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Message Sent!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Thank you for reaching out. I'll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Response Time Info Tooltip - Icon Only */}
      <div className="flex justify-end mb-4">
        <div className="group relative">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center cursor-help
                          hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg shadow-xl 
                          opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10
                          border border-gray-700">
            <div className="absolute -top-2 right-4 w-4 h-4 bg-gray-900 dark:bg-gray-800 border-l border-t border-gray-700 transform rotate-45"></div>
            <p className="relative">
              I typically respond within <strong className="text-blue-400">~24 hours</strong> during weekdays.
            </p>
          </div>
        </div>
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white
            focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-gray-900
            focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10
            transition-all duration-200 placeholder:text-gray-400"
          placeholder="John Doe"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white
            focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-gray-900
            focus:ring-4 focus:ring-purple-500/10 dark:focus:ring-purple-400/10
            transition-all duration-200 placeholder:text-gray-400"
          placeholder="john@example.com"
        />
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white
            focus:border-green-500 dark:focus:border-green-400 focus:bg-white dark:focus:bg-gray-900
            focus:ring-4 focus:ring-green-500/10 dark:focus:ring-green-400/10
            transition-all duration-200 placeholder:text-gray-400"
          placeholder="Project Collaboration"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white
            focus:border-orange-500 dark:focus:border-orange-400 focus:bg-white dark:focus:bg-gray-900
            focus:ring-4 focus:ring-orange-500/10 dark:focus:ring-orange-400/10
            transition-all duration-200 resize-none placeholder:text-gray-400"
          placeholder="Tell me about your project..."
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-6 rounded-xl font-semibold text-white
          bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600
          flex items-center justify-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed
          transform hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
