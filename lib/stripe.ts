export const STRIPE_CONFIG = {
  CHECKOUT_URL: import.meta.env.VITE_STRIPE_CHECKOUT_URL || '',
  PORTAL_URL: import.meta.env.VITE_STRIPE_PORTAL_URL || ''
};

export const startCheckout = (userEmail?: string) => {
  if (!STRIPE_CONFIG.CHECKOUT_URL) {
    console.warn("Stripe Checkout URL not configured");
    alert("Stripe Configuration Missing:\nPlease add your STRIPE_CHECKOUT_URL in lib/stripe.ts");
    return;
  }
  
  let url = STRIPE_CONFIG.CHECKOUT_URL;
  
  // Append email to pre-fill the checkout form if provided
  if (userEmail) {
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}prefilled_email=${encodeURIComponent(userEmail)}`;
  }

  // Open checkout in new tab
  window.open(url, '_self'); // Open in same tab for smoother flow
};

export const openPortal = () => {
  if (!STRIPE_CONFIG.PORTAL_URL) {
    console.warn("Stripe Portal URL not configured");
    alert("Stripe Configuration Missing:\nPlease add your STRIPE_PORTAL_URL in lib/stripe.ts");
    return;
  }
  // Open portal in new tab
  window.open(STRIPE_CONFIG.PORTAL_URL, '_blank');
};
