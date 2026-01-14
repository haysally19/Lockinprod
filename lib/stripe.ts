import { supabase } from './supabase';

export const STRIPE_CONFIG = {
  PRICE_ID: import.meta.env.VITE_STRIPE_PRICE_ID || ''
};

export const startCheckout = async () => {
  if (!STRIPE_CONFIG.PRICE_ID) {
    console.error("Stripe Price ID not configured");
    alert("Stripe Configuration Missing:\nPlease add your VITE_STRIPE_PRICE_ID to the .env file");
    return;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert("Please log in to upgrade");
      return;
    }

    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;
    const currentUrl = window.location.origin;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_id: STRIPE_CONFIG.PRICE_ID,
        mode: 'subscription',
        success_url: `${currentUrl}?checkout=success`,
        cancel_url: `${currentUrl}?checkout=canceled`
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();

    if (url) {
      window.location.href = url;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Failed to start checkout. Please try again.');
  }
};

export const openPortal = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      alert("Please log in to manage your subscription");
      return;
    }

    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-portal-session`;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        return_url: window.location.origin
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create portal session');
    }

    const { url } = await response.json();

    if (url) {
      window.open(url, '_blank');
    } else {
      throw new Error('No portal URL returned');
    }
  } catch (error) {
    console.error('Portal error:', error);
    alert('Failed to open customer portal. Please try again.');
  }
};
