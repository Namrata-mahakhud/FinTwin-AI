import mongoose, { Document, Schema } from 'mongoose';

export enum SimulationStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface ISimulationResult {
  sector: string;
  impactPercent: number;
  profitLoss: number;
  riskScore: number;
  marketReaction: Record<string, unknown>;
  timestamp: Date;
}

export interface ISimulationSummary {
  totalImpact: number;
  riskScore: number;
  affectedSectors: string[];
}

export interface ISimulation extends Document {
  scenarioId: mongoose.Types.ObjectId;
  portfolioId: mongoose.Types.ObjectId;
  executedAt: Date;
  completedAt?: Date;
  status: SimulationStatus;
  duration?: number;
  configuration: {
    timeHorizon: string;
    granularity: string;
    includeSecondaryEffects: boolean;
  };
  summary: ISimulationSummary;
  results: ISimulationResult[];
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const simulationResultSchema = new Schema<ISimulationResult>(
  {
    sector: {
      type: String,
      required: true,
    },
    impactPercent: {
      type: Number,
      required: true,
    },
    profitLoss: {
      type: Number,
      required: true,
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    marketReaction: {
      type: Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const simulationSchema = new Schema<ISimulation>(
  {
    scenarioId: {
      type: Schema.Types.ObjectId,
      ref: 'Scenario',
      required: true,
      index: true,
    },
    portfolioId: {
      type: Schema.Types.ObjectId,
      ref: 'Portfolio',
      required: true,
      index: true,
    },
    executedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    completedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(SimulationStatus),
      default: SimulationStatus.PENDING,
      index: true,
    },
    duration: {
      type: Number, // in milliseconds
    },
    configuration: {
      timeHorizon: {
        type: String,
        default: '1_YEAR',
      },
      granularity: {
        type: String,
        default: 'DAILY',
      },
      includeSecondaryEffects: {
        type: Boolean,
        default: true,
      },
    },
    summary: {
      totalImpact: {
        type: Number,
        default: 0,
      },
      riskScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      affectedSectors: {
        type: [String],
        default: [],
      },
    },
    results: {
      type: [simulationResultSchema],
      default: [],
    },
    error: {
      type: String,
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
simulationSchema.index({ scenarioId: 1, portfolioId: 1 });
simulationSchema.index({ status: 1, executedAt: -1 });
simulationSchema.index({ createdAt: -1 });

// Virtual for recommendations
simulationSchema.virtual('recommendations', {
  ref: 'Recommendation',
  localField: '_id',
  foreignField: 'simulationId',
});

export const Simulation = mongoose.model<ISimulation>('Simulation', simulationSchema);

// Made with Bob
