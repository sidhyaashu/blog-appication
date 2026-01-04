'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useNewsletter } from '@/hooks/useNewsletter';
import { Loader2 } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { subscribe, isLoading, isSuccess, clearStatus } = useNewsletter();

  useEffect(() => {
    if (isSuccess) {
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
      setAgreed(false);
      clearStatus();
    }
  }, [isSuccess, clearStatus]);

  const handleSubscribe = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!agreed) {
      toast.error('Please agree to the privacy policy');
      return;
    }

    const result = await subscribe(email);

    if (result.type.endsWith('/rejected')) {
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
      <h3 className="text-2xl font-bold mb-2">Subscribe</h3>

      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-2">
          Stay Updated with Ovanthra
        </h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Subscribe to our newsletter for the latest AI insights and updates
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
          className="w-full"
          disabled={isLoading}
        />

        <Button
          onClick={handleSubscribe}
          disabled={isLoading || !email || !agreed}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>➤ Subscribe</>
          )}
        </Button>

        <div className="flex items-start gap-2">
          <Checkbox
            id="privacy"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
            disabled={isLoading}
            className="mt-0.5"
          />
          <label htmlFor="privacy" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer leading-tight">
            I agree to receive newsletters and accept the privacy policy
          </label>
        </div>
      </div>
    </div>
  );
}
