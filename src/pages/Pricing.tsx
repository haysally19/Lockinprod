import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { supabase } from '../lib/supabase';

export function Pricing() {
  const { user } = useAuth();
  const [userTier, setUserTier] = useState<string>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserTier = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('tier')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserTier(profile.tier || 'free');
        }
      } catch (error) {
        console.error('Error fetching user tier:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTier();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Please sign in to view pricing</h1>
          <p className="text-gray-600">You need to be logged in to access subscription plans.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Unlock the full potential of AI-powered learning
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-gray-600 mb-6">Get started with basic features</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-gray-700">5 AI sessions per day</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-gray-700">Basic course management</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-gray-300 rounded-full mr-3"></div>
                  <span className="text-gray-700">Community support</span>
                </div>
              </div>

              <button
                disabled
                className="w-full py-3 px-4 rounded-lg font-semibold bg-gray-100 text-gray-500 cursor-not-allowed"
              >
                {userTier === 'free' ? 'Current Plan' : 'Free Forever'}
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <SubscriptionCard userTier={userTier} />
        </div>
      </div>
    </div>
  );
}