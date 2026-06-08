/**
 * Portfolio Snapshot Model
 * Stores portfolio state at different points in time
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolioSnapshot extends Document {
  userId: string;
  portfolioId: string;
  snapshotDate: Date;
  portfolioData: {
    totalValue: number;
    assets: Array<{
      symbol: string;
      name: string;
      value: number;
      percentage: number;
      sector: string;
    }>;
    allocation: Record<string, number>;
  };
  riskScore: number;
  metrics: {
    volatility: number;
    beta: number;
    sharpeRatio: number;
    diversificationScore: number;
  };
  triggerEvent?: string; // What caused this snapshot (e.g., 'recommendation_applied', 'monthly_snapshot')
}

const PortfolioSnapshotSchema = new Schema<IPortfolioSnapshot>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    portfolioId: {
      type: String,
      required: true,
      ref: 'Portfolio',
    },
    snapshotDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    portfolioData: {
      totalValue: { type: Number, required: true },
      assets: [
        {
          symbol: String,
          name: String,
          value: Number,
          percentage: Number,
          sector: String,
        },
      ],
      allocation: { type: Map, of: Number },
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    metrics: {
      volatility: Number,
      beta: Number,
      sharpeRatio: Number,
      diversificationScore: Number,
    },
    triggerEvent: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
PortfolioSnapshotSchema.index({ userId: 1, snapshotDate: -1 });
PortfolioSnapshotSchema.index({ portfolioId: 1, snapshotDate: -1 });

export const PortfolioSnapshot = mongoose.model<IPortfolioSnapshot>(
  'PortfolioSnapshot',
  PortfolioSnapshotSchema
);

// Made with Bob
