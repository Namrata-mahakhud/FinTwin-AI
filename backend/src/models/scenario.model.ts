import mongoose, { Document, Schema } from 'mongoose';

export enum EventType {
  INTEREST_RATE_CHANGE = 'INTEREST_RATE_CHANGE',
  INFLATION_CHANGE = 'INFLATION_CHANGE',
  SECTOR_CRASH = 'SECTOR_CRASH',
  CURRENCY_FLUCTUATION = 'CURRENCY_FLUCTUATION',
  OIL_PRICE_CHANGE = 'OIL_PRICE_CHANGE',
  GLOBAL_CRISIS = 'GLOBAL_CRISIS',
}

export enum ScenarioStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface IScenarioParameters extends Record<string, unknown> {
  changePercent?: number;
  duration?: string;
  affectedRegions?: string[];
  severity?: string;
  customParams?: Record<string, unknown>;
}

export interface IScenario extends Document {
  name: string;
  description: string;
  eventType: EventType;
  parameters: IScenarioParameters;
  targetDate: Date;
  createdBy: mongoose.Types.ObjectId;
  status: ScenarioStatus;
  createdAt: Date;
  updatedAt: Date;
}

const scenarioSchema = new Schema<IScenario>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      enum: Object.values(EventType),
      required: true,
      index: true,
    },
    parameters: {
      changePercent: {
        type: Number,
      },
      duration: {
        type: String,
      },
      affectedRegions: {
        type: [String],
      },
      severity: {
        type: String,
      },
      customParams: {
        type: Schema.Types.Mixed,
      },
    },
    targetDate: {
      type: Date,
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(ScenarioStatus),
      default: ScenarioStatus.DRAFT,
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
scenarioSchema.index({ name: 1, createdBy: 1 });
scenarioSchema.index({ eventType: 1, status: 1 });
scenarioSchema.index({ createdAt: -1 });
scenarioSchema.index({ targetDate: 1 });

// Virtual for simulations
scenarioSchema.virtual('simulations', {
  ref: 'Simulation',
  localField: '_id',
  foreignField: 'scenarioId',
});

export const Scenario = mongoose.model<IScenario>('Scenario', scenarioSchema);

// Made with Bob
