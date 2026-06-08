/**
 * Applied Recommendation Model
 * Tracks recommendations that users have applied
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IAppliedRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  recommendationId: string;
  recommendationType: string;
  priority: string;
  title: string;
  description: string;
  action: string;
  expectedImpact: number;
  actualImpact?: number;
  confidence: number;
  reasoning: string[];
  scenarioId: mongoose.Types.ObjectId;
  portfolioId: mongoose.Types.ObjectId;
  beforeSnapshot: mongoose.Types.ObjectId;
  afterSnapshot?: mongoose.Types.ObjectId;
  effectiveness?: number;
  status: 'active' | 'completed' | 'reverted';
  appliedAt: Date;
  completedAt?: Date;
  notes?: string;
}

const AppliedRecommendationSchema = new Schema<IAppliedRecommendation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recommendationId: {
      type: String,
      required: true,
    },
    recommendationType: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    expectedImpact: {
      type: Number,
      required: true,
    },
    actualImpact: {
      type: Number,
    },
    confidence: {
      type: Number,
      required: true,
    },
    reasoning: {
      type: [String],
      required: true,
    },
    scenarioId: {
      type: Schema.Types.ObjectId,
      ref: 'Scenario',
      required: true,
    },
    portfolioId: {
      type: Schema.Types.ObjectId,
      ref: 'Portfolio',
      required: true,
    },
    beforeSnapshot: {
      type: Schema.Types.ObjectId,
      ref: 'PortfolioSnapshot',
      required: true,
    },
    afterSnapshot: {
      type: Schema.Types.ObjectId,
      ref: 'PortfolioSnapshot',
    },
    effectiveness: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'reverted'],
      default: 'active',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
AppliedRecommendationSchema.index({ userId: 1, appliedAt: -1 });
AppliedRecommendationSchema.index({ scenarioId: 1 });
AppliedRecommendationSchema.index({ status: 1 });

export const AppliedRecommendation = mongoose.model<IAppliedRecommendation>(
  'AppliedRecommendation',
  AppliedRecommendationSchema
);

// Made with Bob