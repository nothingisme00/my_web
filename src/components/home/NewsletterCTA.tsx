'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';

export function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      addToast('error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Integrate with newsletter service (Resend/ConvertKit/etc)
      // For now, just show success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      addToast('success', 'Thanks for subscribing! Check your inbox for confirmation.');
      setEmail('');
    } catch (error) {
      addToast('error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 p-8 md:p-12">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-white/20 backdrop-blur-sm">
              <Mail className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>

            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Get the latest articles about software testing, QA, and tech delivered straight to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-lg bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 border-2 border-transparent focus:border-white focus:outline-none focus:ring-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>

            <p className="mt-4 text-sm text-blue-100">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
