import mongoose, { Document } from 'mongoose';

export interface ICycleData extends Document {
  lastPeriodStart: Date;
  cycleLength: number;
  periodLength: number;
  periodLogs: Array<{
    startDate: Date;
    endDate: Date;
    flow: 'light' | 'medium' | 'heavy';
  }>;
  symptoms: Array<{
    date: Date;
    type: string;
    severity: number;
  }>;
}

const cycleDataSchema = new mongoose.Schema({
  lastPeriodStart: { type: Date, required: true },
  cycleLength: { type: Number, default: 28 },
  periodLength: { type: Number, default: 5 },
  periodLogs: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    flow: { 
      type: String, 
      enum: ['light', 'medium', 'heavy'],
      required: true 
    }
  }],
  symptoms: [{
    date: { type: Date, required: true },
    type: { type: String, required: true },
    severity: { type: Number, min: 1, max: 5 }
  }]
}, {
  timestamps: true
});

export default mongoose.model<ICycleData>('CycleData', cycleDataSchema);