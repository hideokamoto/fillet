# Advanced Pricing Example

This example showcases advanced pricing strategies available in Stripe, including tiered pricing, metered billing, and hybrid models.

## What's Included

- **Tiered Pricing**: Volume-based discounts for API calls
- **Graduated Pricing**: Different rates at different usage levels
- **Per-Seat Pricing**: Traditional SaaS seat-based billing
- **Metered Billing**: Usage-based pricing for storage
- **Hybrid Model**: Base subscription + usage overages
- **Transform Quantity**: Charge per batch of items

## Pricing Models

### 1. API Calls (Graduated Tiers)
```
First 1,000 calls:  $0.10 each
Next 9,000 calls:   $0.05 each
Beyond 10,000:      $0.02 each
```

### 2. API Calls (Volume Pricing)
```
≤ 1,000 calls:      $0.10 each (all calls)
1,001-10,000:       $0.07 each (all calls)
> 10,000:           $0.03 each (all calls)
```

### 3. Team Collaboration (Per-Seat)
```
Monthly:  $15/seat/month
Yearly:   $150/seat/year
```

### 4. Cloud Storage (Metered)
```
Simple:     $0.20/GB/month
Graduated:  $0.50/GB (0-100 GB)
            $0.30/GB (100-1,000 GB)
            $0.20/GB (>1,000 GB)
```

### 5. Professional Service (Hybrid)
```
Base:       $49.99/month
Overage:    $1.00 per additional unit
```

### 6. Bulk Processing
```
$5.00 per 100 items (rounded up)
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

3. **Build and deploy**:
   ```bash
   pnpm build
   pnpm deploy
   ```

## Use Cases

- **SaaS Applications**: Per-seat pricing with volume discounts
- **API Services**: Usage-based billing with tiered rates
- **Cloud Platforms**: Storage and compute metered billing
- **Marketplaces**: Transaction-based fees
- **Data Processing**: Batch processing charges

## Key Concepts

### Graduated vs Volume Pricing

**Graduated**: Each tier is charged independently
- Example: First 1,000 @ $0.10, next 9,000 @ $0.05
- 5,000 calls = (1,000 × $0.10) + (4,000 × $0.05) = $300

**Volume**: All units charged at the same rate based on total
- Example: 5,000 calls = 5,000 × $0.05 = $250

### Metered vs Licensed

**Metered**: Charge based on actual usage during billing period
- API calls, storage, compute time
- Usage resets each period

**Licensed**: Fixed quantity set at subscription time
- Per-seat, per-user pricing
- Quantity can be updated mid-period

## Learn More

See the [main documentation](../../README.md) for more information about pricectl.
