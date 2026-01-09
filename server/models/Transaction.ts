import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  date: string;
  amount: number;
  category: string;
  description: string;
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Ensure virtual 'id' field is sent in JSON
TransactionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
