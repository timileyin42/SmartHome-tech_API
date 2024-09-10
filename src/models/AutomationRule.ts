import mongoose, { Document, Schema } from 'mongoose';

interface IAutomationRule extends Document {
  name: string;
  type: string; // e.g., 'time-based', 'event-based', 'conditional'
  conditions: Record<string, any>;
  actions: Record<string, any>;
}

const AutomationRuleSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  conditions: { type: Schema.Types.Mixed, required: true },
  actions: { type: Schema.Types.Mixed, required: true },
});

export default mongoose.model<IAutomationRule>('AutomationRule', AutomationRuleSchema);

