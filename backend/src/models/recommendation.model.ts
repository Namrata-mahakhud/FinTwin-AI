import mongoose, { Document, Schema } from 'mongoose';

export enum AgentType {
  MARKET = 'MARKET',
  RISK = 'RISK',
  RECOMMENDATION = 'RECOMMENDATION',
  REPORT = 'REPORT',
}

export enum RecommendationCategory {
  RISK_MITIGATION = 'RISK_MITIGATION',
  PORTFOLIO_REBALANCE = 'PORTFOLIO_REBALANCE',
  SECTOR_DIVERSIFICATION = 'SECTOR_DIVERSIFICATION',
  FUTURE_WARNING = 'FUTURE_WARNING',
}

export interface IRecommendation extends Document {
  simulationId: mongoose.Types.ObjectId;
  agentType: AgentType;
  category: RecommendationCategory;
  recommendation: string;
  priority: number;
  reasoning: {
    analysis: string;
    confidence: number;
    supportingData: Record<string, unknown>;
  };
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const recommendationSchema = new Schema<IRecommendation>(
  {
    simulationId: {
      type: Schema.Types.ObjectId,
      ref: 'Simulation',
      required: true,
      index: true,
    },
    agentType: {
      type: String,
      enum: Object.values(AgentType),
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(RecommendationCategory),
      required: true,
      index: true,
    },
    recommendation: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      default: 5,
    },
    reasoning: {
      analysis: {
        type: String,
        required: true,
      },
      confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
      },
      supportingData: {
        type: Schema.Types.Mixed,
      },
    },
    generatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: any) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
recommendationSchema.index({ simulationId: 1, priority: -1 });
recommendationSchema.index({ category: 1, generatedAt: -1 });
recommendationSchema.index({ agentType: 1 });

export const Recommendation = mongoose.model<IRecommendation>(
  'Recommendation',
  recommendationSchema
);

// Made with Bob
