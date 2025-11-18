import Stripe from 'stripe';
import { StackManifest, ResourceManifest } from '@fillet/core';

export interface DeployResult {
  stackId: string;
  deployed: Array<{
    id: string;
    type: string;
    physicalId: string;
    status: 'created' | 'updated' | 'unchanged';
  }>;
  errors: Array<{
    id: string;
    type: string;
    error: string;
  }>;
}

export class StripeDeployer {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
    });
  }

  async deploy(manifest: StackManifest): Promise<DeployResult> {
    const result: DeployResult = {
      stackId: manifest.stackId,
      deployed: [],
      errors: [],
    };

    for (const resource of manifest.resources) {
      try {
        const deployed = await this.deployResource(resource);
        result.deployed.push(deployed);
      } catch (error: any) {
        result.errors.push({
          id: resource.id,
          type: resource.type,
          error: error.message,
        });
      }
    }

    return result;
  }

  private async deployResource(resource: ResourceManifest) {
    switch (resource.type) {
      case 'Stripe::Product':
        return this.deployProduct(resource);
      case 'Stripe::Price':
        return this.deployPrice(resource);
      case 'Stripe::Coupon':
        return this.deployCoupon(resource);
      default:
        throw new Error(`Unknown resource type: ${resource.type}`);
    }
  }

  private async deployProduct(resource: ResourceManifest) {
    // Check if product already exists (you can use metadata to store logical IDs)
    const existing = await this.findExistingProduct(resource.id);

    if (existing) {
      // Update existing product
      const updated = await this.stripe.products.update(existing.id, resource.properties);
      return {
        id: resource.id,
        type: resource.type,
        physicalId: updated.id,
        status: 'updated' as const,
      };
    } else {
      // Create new product
      const created = await this.stripe.products.create({
        ...resource.properties,
        metadata: {
          ...resource.properties.metadata,
          fillet_id: resource.id,
          fillet_path: resource.path,
        },
      });
      return {
        id: resource.id,
        type: resource.type,
        physicalId: created.id,
        status: 'created' as const,
      };
    }
  }

  private async deployPrice(resource: ResourceManifest) {
    // Prices cannot be updated, only created
    const existing = await this.findExistingPrice(resource.id);

    if (existing) {
      // Check if properties match
      const propsMatch = this.comparePriceProperties(existing, resource.properties);
      if (propsMatch) {
        return {
          id: resource.id,
          type: resource.type,
          physicalId: existing.id,
          status: 'unchanged' as const,
        };
      } else {
        // Deactivate old price and create new one
        await this.stripe.prices.update(existing.id, { active: false });
        const created = await this.stripe.prices.create({
          ...resource.properties,
          metadata: {
            ...resource.properties.metadata,
            fillet_id: resource.id,
            fillet_path: resource.path,
          },
        });
        return {
          id: resource.id,
          type: resource.type,
          physicalId: created.id,
          status: 'created' as const,
        };
      }
    } else {
      const created = await this.stripe.prices.create({
        ...resource.properties,
        metadata: {
          ...resource.properties.metadata,
          fillet_id: resource.id,
          fillet_path: resource.path,
        },
      });
      return {
        id: resource.id,
        type: resource.type,
        physicalId: created.id,
        status: 'created' as const,
      };
    }
  }

  private async deployCoupon(resource: ResourceManifest) {
    // Check if coupon already exists
    try {
      const existing = await this.stripe.coupons.retrieve(resource.id);
      return {
        id: resource.id,
        type: resource.type,
        physicalId: existing.id,
        status: 'unchanged' as const,
      };
    } catch (error: any) {
      if (error.code === 'resource_missing') {
        // Create new coupon
        const created = await this.stripe.coupons.create({
          id: resource.id,
          ...resource.properties,
        });
        return {
          id: resource.id,
          type: resource.type,
          physicalId: created.id,
          status: 'created' as const,
        };
      }
      throw error;
    }
  }

  private async findExistingProduct(logicalId: string): Promise<Stripe.Product | null> {
    try {
      const products = await this.stripe.products.list({ limit: 100 });
      const found = products.data.find(p => p.metadata?.fillet_id === logicalId);
      return found || null;
    } catch {
      return null;
    }
  }

  private async findExistingPrice(logicalId: string): Promise<Stripe.Price | null> {
    try {
      const prices = await this.stripe.prices.list({ limit: 100 });
      const found = prices.data.find(p => p.metadata?.fillet_id === logicalId);
      return found || null;
    } catch {
      return null;
    }
  }

  private comparePriceProperties(existing: Stripe.Price, desired: any): boolean {
    return (
      existing.currency === desired.currency &&
      existing.unit_amount === desired.unit_amount &&
      existing.recurring?.interval === desired.recurring?.interval &&
      existing.recurring?.interval_count === desired.recurring?.interval_count
    );
  }

  async destroy(manifest: StackManifest): Promise<void> {
    // Delete resources in reverse order
    const resources = [...manifest.resources].reverse();

    for (const resource of resources) {
      try {
        await this.destroyResource(resource);
      } catch (error: any) {
        console.error(`Failed to delete ${resource.id}:`, error.message);
      }
    }
  }

  private async destroyResource(resource: ResourceManifest): Promise<void> {
    switch (resource.type) {
      case 'Stripe::Product': {
        const existing = await this.findExistingProduct(resource.id);
        if (existing) {
          await this.stripe.products.del(existing.id);
        }
        break;
      }
      case 'Stripe::Price': {
        const existing = await this.findExistingPrice(resource.id);
        if (existing) {
          // Prices cannot be deleted, only deactivated
          await this.stripe.prices.update(existing.id, { active: false });
        }
        break;
      }
      case 'Stripe::Coupon': {
        try {
          await this.stripe.coupons.del(resource.id);
        } catch (error: any) {
          if (error.code !== 'resource_missing') {
            throw error;
          }
        }
        break;
      }
    }
  }
}
