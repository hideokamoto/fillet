# Basic Subscription Example

This example demonstrates how to create a simple SaaS subscription infrastructure using Stripe RDK.

## What's Included

- **Three subscription tiers**: Basic, Pro, and Enterprise
- **Flexible billing**: Monthly and yearly pricing options
- **Promotional coupons**: Welcome discount, seasonal sales, and upgrade incentives

## Project Structure

```
├── stripe-rdk.ts      # Stack definition
├── package.json       # Project dependencies
└── tsconfig.json      # TypeScript configuration
```

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set your Stripe API key**:
   ```bash
   export STRIPE_SECRET_KEY=sk_test_...
   ```

3. **Build the TypeScript files**:
   ```bash
   pnpm build
   ```

4. **Preview changes**:
   ```bash
   pnpm diff
   ```

5. **Deploy to Stripe**:
   ```bash
   pnpm deploy
   ```

## Commands

- `pnpm synth` - Synthesize the stack into a manifest
- `pnpm diff` - Compare local definition with deployed resources
- `pnpm deploy` - Deploy the stack to Stripe
- `pnpm destroy` - Remove all resources from Stripe

## What Gets Created

### Products
1. **Basic Plan** ($9.99/month or $99.99/year)
2. **Pro Plan** ($29.99/month or $299.99/year)
3. **Enterprise Plan** ($99.99/month)

### Coupons
1. **Welcome Discount** - 20% off first payment
2. **Summer Sale 2024** - 30% off for 3 months
3. **Annual Upgrade Discount** - 15% off forever

## Customization

Edit `stripe-rdk.ts` to:
- Add or remove pricing tiers
- Change pricing amounts
- Create new promotional campaigns
- Add metadata for tracking

## Learn More

See the [main documentation](../../README.md) for more information about Stripe RDK.
