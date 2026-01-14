# Stripe Integration Setup Guide

This application now has full Stripe checkout and subscription management integrated. Follow these steps to complete the setup.

## Prerequisites

- A Stripe account (create one at https://stripe.com)
- Access to your Supabase project dashboard

## Step 1: Get Your Stripe Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API Keys**
3. Copy your **Secret Key** (starts with `sk_test_` for test mode or `sk_live_` for production)

## Step 2: Create a Product and Price

1. In your Stripe Dashboard, go to **Products** → **Add Product**
2. Create a product called "Pro Scholar" (or your preferred name)
3. Set the price to **$14.99/month** (recurring)
4. After creating, copy the **Price ID** (starts with `price_`)

## Step 3: Configure Supabase Secrets

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Settings** → **Edge Functions**
3. Add the following secrets:

   - `STRIPE_SECRET_KEY`: Your Stripe secret key from Step 1
   - `STRIPE_PRICE_ID`: Your Stripe price ID from Step 2

## Step 4: Set Up Stripe Webhooks

Webhooks allow Stripe to notify your app about subscription events (payments, cancellations, etc.)

1. In your Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add Endpoint**
3. Set the endpoint URL to:
   ```
   https://[your-project-ref].supabase.co/functions/v1/stripe-webhooks
   ```
   Replace `[your-project-ref]` with your Supabase project reference (found in your Supabase project URL)

4. Select the following events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

5. Click **Add Endpoint**
6. After creating, click on the webhook to reveal the **Signing Secret** (starts with `whsec_`)
7. Go back to your Supabase Dashboard → **Settings** → **Edge Functions**
8. Add a new secret:
   - `STRIPE_WEBHOOK_SECRET`: Your webhook signing secret

## Step 5: Enable Stripe Customer Portal (Optional but Recommended)

The Customer Portal allows users to manage their subscriptions, update payment methods, and view billing history.

1. In your Stripe Dashboard, go to **Settings** → **Billing** → **Customer Portal**
2. Click **Activate test link** (or configure and activate for production)
3. Configure the settings:
   - Enable subscription cancellation
   - Enable payment method updates
   - Customize the portal appearance to match your brand

## How It Works

### Checkout Flow
1. User clicks "Upgrade to Pro" in your app
2. App calls the `create-checkout-session` edge function
3. User is redirected to Stripe Checkout
4. After successful payment, Stripe webhook notifies your app
5. User's tier is automatically updated to "pro"

### Subscription Management
1. User clicks "Manage Subscription" in Settings
2. App calls the `create-portal-session` edge function
3. User is redirected to Stripe Customer Portal
4. User can cancel, update payment method, or view invoices
5. Changes are synced via webhooks

### Database Schema
The integration uses three main tables:
- `customers`: Links Supabase users to Stripe customers
- `subscriptions`: Stores subscription data
- `profiles`: Updated automatically based on subscription status

### Security
- All Edge Functions use proper authentication
- Webhooks are verified using Stripe signatures
- Row Level Security (RLS) ensures users can only access their own data
- The webhook endpoint is public (as required by Stripe) but validates all requests

## Testing

### Test Mode
1. Use test API keys (starting with `sk_test_`)
2. Use test cards from [Stripe's testing guide](https://stripe.com/docs/testing):
   - Success: `4242 4242 4242 4242`
   - Declined: `4000 0000 0000 0002`
3. Use any future expiry date and any CVC

### Production
1. Switch to live API keys (starting with `sk_live_`)
2. Update webhook endpoint to use live mode
3. Test with a real card before launching

## Troubleshooting

### Checkout not working
- Verify `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID` are set in Supabase
- Check browser console for errors
- Ensure user is logged in

### Subscription status not updating
- Verify `STRIPE_WEBHOOK_SECRET` is set correctly
- Check webhook delivery attempts in Stripe Dashboard
- View Edge Function logs in Supabase Dashboard

### Portal not opening
- Ensure Customer Portal is activated in Stripe Dashboard
- Verify user has an existing subscription
- Check that customer exists in the `customers` table

## Support

For more information:
- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
