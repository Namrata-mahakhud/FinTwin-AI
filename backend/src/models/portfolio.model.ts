import mongoose, { Document, Schema } from 'mongoose';

export enum RiskAppetite {
  CONSERVATIVE = 'CONSERVATIVE',
  MODERATE = 'MODERATE',
  AGGRESSIVE = 'AGGRESSIVE',
}

export interface IPortfolioAsset {
  assetType: string;
  symbol: string;
  quantity: number;
  allocationPercent: number;
  currentValue: number;
}

export interface IPortfolio extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  totalValue: number;
  riskAppetite: RiskAppetite;
  currency: string;
  assets: IPortfolioAsset[];
  metadata: {
    description?: string;
    tags?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const portfolioAssetSchema = new Schema<IPortfolioAsset>(
  {
    assetType: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    allocationPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    currentValue: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const portfolioSchema = new Schema<IPortfolio>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    totalValue: {
      type: Number,
      required: true,
      min: 0,
    },
    riskAppetite: {
      type: String,
      enum: Object.values(RiskAppetite),
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    assets: {
      type: [portfolioAssetSchema],
      validate: {
        validator: function (assets: IPortfolioAsset[]) {
          const totalAllocation = assets.reduce(
            (sum, asset) => sum + asset.allocationPercent,
            0
          );
          return Math.abs(totalAllocation - 100) < 0.01; // Allow small floating point errors
        },
        message: 'Total asset allocation must equal 100%',
      },
    },
    metadata: {
      description: {
        type: String,
      },
      tags: {
        type: [String],
      },
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
portfolioSchema.index({ userId: 1, name: 1 });
portfolioSchema.index({ createdAt: -1 });
portfolioSchema.index({ riskAppetite: 1 });

// Virtual for simulations
portfolioSchema.virtual('simulations', {
  ref: 'Simulation',
  localField: '_id',
  foreignField: 'portfolioId',
});

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', portfolioSchema);

// Made with Bob
