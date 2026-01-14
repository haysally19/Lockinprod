import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { supabase } from '../lib/supabase';

interface SubscriptionCardProps {
  userTier: string;
}

export function SubscriptionCard({ userTier }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);
  const product = STRIPE_PRODUCTS[0]; // Lockin AI Pro

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: product.priceId,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isCurrentPlan = userTier === 'pro';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-indigo-200">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-indigo-600">${product.price}</span>
          <span className="text-gray-600">/month</span>
        </div>
        <p className="text-gray-600 mb-6">{product.description}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">Unlimited AI tutoring sessions</span>
          </div>
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">Advanced course management</span>
          </div>
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">Priority support</span>
          </div>
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">Export study materials</span>
          </div>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading || isCurrentPlan}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            isCurrentPlan
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : loading
              ? 'bg-indigo-400 text-white cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Processing...
            </div>
          ) : isCurrentPlan ? (
            'Current Plan'
          ) : (
            'Upgrade to Pro'
          )}
        </button>
      </div>
    </div>
  );
}