"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { FadeInWhenVisible } from "@/components/animations";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      addToast("error", "Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Integrate with newsletter service (Resend/ConvertKit/etc)
      // For now, just show success message
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      addToast(
        "success",
        "Thanks for subscribing! Check your inbox for confirmation."
      );
      setEmail("");
    } catch {
      addToast("error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <FadeInWhenVisible>
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 p-8 md:p-12">
            {/* Subtle decorative pattern */}
            <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02]" />

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gray-200/60 dark:bg-gray-700/60 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50">
                <Mail className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Stay Updated
              </h2>

              <p className="text-base text-gray-600 dark:text-gray-400 mb-7 max-w-2xl mx-auto">
                Get the latest articles about software testing, QA, and tech
                delivered straight to your inbox.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-600 focus:border-gray-400 dark:focus:border-gray-500 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-50 text-sm">
                  {isLoading ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>

              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                No spam, unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>
    </section>
  );
}
