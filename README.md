# Fillet

<p align="center">
  <strong>Infrastructure as Code for Stripe</strong>
</p>

<p align="center">
  AWS CDK-like tool for managing Stripe resources with TypeScript
</p>

---

## Overview

Fillet is an Infrastructure as Code (IaC) tool for Stripe, inspired by AWS CDK. It allows you to define your Stripe resources (products, prices, coupons, etc.) using TypeScript classes and deploy them with simple CLI commands.

### Why Fillet?

- **Type-Safe**: Define resources with TypeScript for full IDE support and compile-time checks
- **Declarative**: Describe what you want, not how to create it
- **Version Control**: Track changes to your Stripe infrastructure in git
- **Reproducible**: Deploy the same configuration across multiple environments
- **Preview Changes**: See exactly what will change before deploying
- **Familiar DX**: If you know AWS CDK, you already know Fillet

## Quick Start

### Installation

```bash
# Using npm
npm install -g @fillet/cli

# Using pnpm
pnpm add -g @fillet/cli

# Using yarn
yarn global add @fillet/cli
```

### Initialize a New Project

```bash
mkdir my-stripe-infrastructure
cd my-stripe-infrastructure
fillet init
```

This creates a basic project structure:

```
my-stripe-infrastructure/
├── fillet.ts          # Your stack definition
├── package.json
├── tsconfig.json
└── .env.example
```

### Define Your Infrastructure

Edit `fillet.ts`:

```typescript
import { Stack } from '@fillet/core';
import { Product, Price, Coupon } from '@fillet/constructs';

// Create a stack
const stack = new Stack(undefined, 'MyStack', {
  description: 'My Stripe Infrastructure',
});

// Define a product
const product = new Product(stack, 'PremiumPlan', {
  name: 'Premium Plan',
  description: 'Access to all premium features',
  active: true,
});

// Add monthly pricing
new Price(stack, 'MonthlyPrice', {
  product,
  currency: 'usd',
  unitAmount: 1999, // $19.99
  recurring: {
    interval: 'month',
  },
});

// Add a promotional coupon
new Coupon(stack, 'Launch20', {
  name: 'Launch Discount',
  percentOff: 20,
  duration: 'once',
});

export default stack;
```

### Deploy to Stripe

```bash
# Set your Stripe API key
export STRIPE_SECRET_KEY=sk_test_...

# Preview changes
npm run diff

# Deploy to Stripe
npm run deploy
```

## Architecture

Fillet is a monorepo containing three main packages:

### 📦 `@fillet/core`

Core IaC framework providing:
- `Construct`: Base class for all resources
- `Stack`: Container for resources
- `Resource`: Base class for Stripe resources

### 📦 `@fillet/constructs`

Stripe resource implementations:
- `Product`: Stripe products
- `Price`: Pricing plans (one-time, recurring, tiered, metered)
- `Coupon`: Discount coupons
- More coming soon (Customers, Subscriptions, PaymentLinks, etc.)

### 📦 `@fillet/cli`

Command-line interface:
- `fillet init`: Initialize a new project
- `fillet synth`: Synthesize stack to manifest
- `fillet diff`: Compare local vs deployed
- `fillet deploy`: Deploy to Stripe
- `fillet destroy`: Remove all resources

## CLI Commands

### `fillet init`

Initialize a new Fillet project with example code.

```bash
fillet init
```

### `fillet synth`

Synthesize your stack into a deployment manifest.

```bash
fillet synth
fillet synth --app ./custom-stack.ts
```

### `fillet diff`

Show differences between your local definition and what's deployed in Stripe.

```bash
fillet diff
fillet diff --app ./custom-stack.ts
```

### `fillet deploy`

Deploy your stack to Stripe.

```bash
fillet deploy
fillet deploy --app ./custom-stack.ts
```

### `fillet destroy`

Remove all resources defined in your stack from Stripe.

```bash
fillet destroy --force
```

## Available Resources

### Product

Define a Stripe product:

```typescript
const myProduct = new Product(stack, 'MyProduct', {
  name: 'My Product',
  description: 'Product description',
  active: true,
  images: ['https://example.com/image.png'],
  metadata: { key: 'value' },
  statementDescriptor: 'MY PRODUCT',
});
```

### Price

Define pricing for a product:

```typescript
// One-time payment
new Price(stack, 'OneTime', {
  product: myProduct,
  currency: 'usd',
  unitAmount: 4999, // $49.99
});

// Recurring subscription
new Price(stack, 'Monthly', {
  product: myProduct,
  currency: 'usd',
  unitAmount: 1999, // $19.99
  recurring: {
    interval: 'month',
  },
});

// Tiered pricing
new Price(stack, 'Graduated', {
  product: myProduct,
  currency: 'usd',
  recurring: {
    interval: 'month',
    usageType: 'metered',
  },
  tiersMode: 'graduated',
  tiers: [
    { upTo: 1000, unitAmount: 10 },
    { upTo: 10000, unitAmount: 5 },
    { upTo: 'inf', unitAmount: 2 },
  ],
});
```

### Coupon

Create promotional discounts:

```typescript
// Percentage discount
new Coupon(stack, 'Sale20', {
  percentOff: 20,
  duration: 'once',
  name: '20% Off',
});

// Fixed amount discount
new Coupon(stack, 'Save10', {
  amountOff: 1000, // $10.00
  currency: 'usd',
  duration: 'repeating',
  durationInMonths: 3,
});
```

## Examples

Check out the [examples](./examples) directory for complete working examples:

- **[basic-subscription](./examples/basic-subscription)**: Simple SaaS subscription with multiple tiers
- **[advanced-pricing](./examples/advanced-pricing)**: Advanced pricing strategies (tiered, metered, per-seat)

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/hideokamoto/fillet.git
cd fillet

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Project Structure

```
fillet/
├── packages/
│   ├── core/          # Core IaC framework
│   ├── constructs/    # Stripe resource constructs
│   └── cli/           # Command-line interface
├── examples/
│   ├── basic-subscription/
│   └── advanced-pricing/
├── pnpm-workspace.yaml
└── package.json
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
cd packages/core
pnpm build
```

### Testing

```bash
# Run tests for all packages
pnpm test

# Run tests for specific package
cd packages/constructs
pnpm test
```

## Roadmap

### v0.2.0
- [ ] Customer resource
- [ ] Subscription resource
- [ ] PaymentLink resource
- [ ] State management (track deployed resources)

### v0.3.0
- [ ] Webhook configuration
- [ ] Tax rate management
- [ ] Shipping rate management
- [ ] Multi-stack support

### v1.0.0
- [ ] Full Stripe API coverage
- [ ] Import existing resources
- [ ] Stack dependencies
- [ ] Custom constructs / patterns

## Comparison with Other Tools

| Feature | Fillet | YAML/JSON | Terraform | Manual |
|---------|--------|-----------|-----------|--------|
| Type Safety | ✅ | ❌ | ⚠️ | ❌ |
| IDE Support | ✅ | ⚠️ | ⚠️ | N/A |
| Diff Preview | ✅ | ❌ | ✅ | ❌ |
| Version Control | ✅ | ✅ | ✅ | ❌ |
| Programmatic | ✅ | ❌ | ⚠️ | ✅ |
| Stripe-Native | ✅ | ✅ | ❌ | ✅ |

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Credits

Inspired by [AWS CDK](https://aws.amazon.com/cdk/) and the amazing work by the AWS team.

---

<p align="center">
  Made with ❤️ for the Stripe developer community
</p>
