import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const startCheckout = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert('Please log in to subscribe');
      throw new Error('No session found');
    }

    console.log('Starting checkout...', {
      url: `${SUPABASE_URL}/functions/v1/create-checkout-session`,
      hasToken: !!session.access_token
    });

    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', response.status, errorText);
      alert(`Failed to start checkout: ${response.status}`);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Checkout response data:', data);

    if (data.error) {
      console.error('Checkout error:', data.error);
      alert(`Failed to start checkout: ${data.error}`);
      throw new Error(data.error);
    }

    if (data.url) {
      console.log('Redirecting to Stripe checkout:', data.url);
      window.location.href = data.url;
    } else {
      console.error('No URL in response data:', data);
      alert('No checkout URL received. Please try again.');
      throw new Error('No checkout URL in response');
    }
  } catch (error) {
    console.error('Error starting checkout:', error);
    if (error instanceof Error && !error.message.includes('No session')) {
      alert('Failed to start checkout. Please check the console for details.');
    }
    throw error;
  }
};

export const openPortal = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert('Please log in to manage your subscription');
      return;
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-portal-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.error) {
      console.error('Portal error:', data.error);
      alert(data.error);
      return;
    }

    if (data.url) {
      window.open(data.url, '_blank');
    }
  } catch (error) {
    console.error('Error opening portal:', error);
    alert('Failed to open customer portal. Please try again.');
  }
};
