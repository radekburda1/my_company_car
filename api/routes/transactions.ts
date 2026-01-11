import express, { Response } from 'express';
import Transaction from '../models/Transaction.js';
import { auth } from './auth.js';
import { AuthRequest } from '../types/express.js';

const router = express.Router();

// @route   GET api/transactions
// @desc    Get all users transactions
// @access  Private
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ msg: 'No user ID' });
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/transactions
// @desc    Add new transaction
// @access  Private
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  const { date, amount, category, description } = req.body;

  try {
    if (!req.user) return res.status(401).json({ msg: 'No user ID' });
    const newTransaction = new Transaction({
      date,
      amount,
      category,
      description,
      userId: req.user.id
    });

    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  const { date, amount, category, description } = req.body;

  // Build transaction object
  const transactionFields: any = {};
  if (date) transactionFields.date = date;
  if (amount) transactionFields.amount = amount;
  if (category) transactionFields.category = category;
  if (description) transactionFields.description = description;

  try {
    if (!req.user) return res.status(401).json({ msg: 'No user ID' });
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

    // Make sure user owns transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: transactionFields },
      { new: true }
    );

    res.json(transaction);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ msg: 'No user ID' });
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

    // Make sure user owns transaction
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Transaction removed' });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
