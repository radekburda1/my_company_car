const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Map frontend "id" to MongoDB "_id" if needed, but standard practice is to use _id
  // However, frontend expects 'id' as string. We can transform it in response.
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
    delete ret._id;
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
