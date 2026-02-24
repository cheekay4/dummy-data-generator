import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

export const PRICE_IDS = {
  proMonthly:  process.env.STRIPE_PRICE_PRO_MONTHLY   ?? '',
  proYearly:   process.env.STRIPE_PRICE_PRO_YEARLY    ?? '',
  teamS:       process.env.STRIPE_PRICE_TEAM_S        ?? '',
  teamM:       process.env.STRIPE_PRICE_TEAM_M        ?? '',
  teamL:       process.env.STRIPE_PRICE_TEAM_L        ?? '',
  adminAddon:  process.env.STRIPE_PRICE_ADMIN_ADDON   ?? '',
} as const;
