import React, { useState } from 'react';
import { Crown, Calendar, CreditCard, Settings, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SubscriptionStatusProps {
  subscription: {
    customer_id?: string;
    subscription_status: string;
    price_id: string | null;
    current_period_end: number | null;
    cancel_at_period_end: boolean;
    payment_method_brand: string | null;
    payment_method_last4: string | null;
  } | null;
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    if (!subscription?.customer_id) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            customerId: subscription.customer_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      alert('Failed to open subscription management portal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <Crown className="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Free Plan</h3>
            <p className="text-sm text-gray-600">Limited features available</p>
          </div>
        </div>
      </div>
    );
  }

  const isActive = subscription.subscription_status === 'active';
  const isPastDue = subscription.subscription_status === 'past_due';
  const isCanceled = subscription.subscription_status === 'canceled';

  const getStatusColor = () => {
    if (isActive) return 'text-green-600 bg-green-100';
    if (isPastDue) return 'text-yellow-600 bg-yellow-100';
    if (isCanceled) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStatusText = () => {
    switch (subscription.subscription_status) {
      case 'active':
        return 'Active';
      case 'past_due':
        return 'Past Due';
      case 'canceled':
        return 'Canceled';
      case 'trialing':
        return 'Trial';
      default:
        return subscription.subscription_status;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
            <Crown className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Lockin AI Pro</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {subscription.current_period_end && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {subscription.cancel_at_period_end ? 'Expires' : 'Renews'} on{' '}
              {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
            </span>
          </div>
        )}

        {subscription.payment_method_brand && subscription.payment_method_last4 && (
          <div className="flex items-center text-sm text-gray-600">
            <CreditCard className="h-4 w-4 mr-2" />
            <span>
              {subscription.payment_method_brand.toUpperCase()} ending in {subscription.payment_method_last4}
            </span>
          </div>
        )}

        {subscription.cancel_at_period_end && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Your subscription will not renew and will end on{' '}
              {subscription.current_period_end &&
                new Date(subscription.current_period_end * 1000).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {subscription.customer_id && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Manage Subscription
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}