export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1SpYK1B02IkHjJelLDOxkUqf',
    name: 'Lockin AI Pro',
    description: 'LockIn AI Full access',
    mode: 'subscription',
  },
];