// src/models/AutomationRule.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IAutomationRule extends Document {
  name: string;
  trigger: {
    type: 'time' | 'sensor';
    value: string; // For time-based: time string, for sensor-based: sensor ID and value
  };
  condition?: {
    type?: string; // Optional type for condition
    value?: string; // Optional value for condition
  };
  action: {
    type: string;
    value: string; // Action to be performed
  };
}

const AutomationRuleSchema: Schema = new Schema({
  name: { type: String, required: true },
  trigger: {
    type: { type: String, enum: ['time', 'sensor'], required: true },
    value: { type: String, required: true }
  },
  condition: {
    type: {
      type: String
    },
    value: {
      type: String
    }
  },
  action: {
    type: { type: String, required: true },
    value: { type: String, required: true }
  }
});

export default mongoose.model<IAutomationRule>('AutomationRule', AutomationRuleSchema);

