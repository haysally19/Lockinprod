import { supabase } from './supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const startCheckout = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert('Please log in to subscribe');
      return;
    }

    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.error) {
      console.error('Checkout error:', data.error);
      alert('Failed to start checkout. Please try again.');
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    }
  } catch (error) {
    console.error('Error starting checkout:', error);
    alert('Failed to start checkout. Please try again.');
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
