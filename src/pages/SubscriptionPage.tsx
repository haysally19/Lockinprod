import React, { useEffect, useState } from 'react';
import { SubscriptionCard } from '../components/subscription/SubscriptionCard';
import { SubscriptionStatus } from '../components/subscription/SubscriptionStatus';
import { stripeProducts } from '../stripe-config';
import { getUserSubscription } from '../lib/stripe';
import { Loader2 } from 'lucide-react';

export function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const data = await getUserSubscription();
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading subscription details...</span>
        </div>
      </div>
    );
  }

  const isCurrentPlan = (priceId: string) => {
    return subscription?.price_id === priceId && subscription?.subscription_status === 'active';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Unlock the full potential of LockIn AI with our Pro subscription
          </p>
        </div>

        <div className="mb-8">
          <SubscriptionStatus subscription={subscription} />
        </div>

        <div className="grid md:grid-cols-1 gap-8 max-w-md mx-auto">
          {stripeProducts.map((product) => (
            <SubscriptionCard
              key={product.priceId}
              product={product}
              isCurrentPlan={isCurrentPlan(product.priceId)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            All subscriptions include a 30-day money-back guarantee
          </p>
        </div>
      </div>
    </div>
  );
}