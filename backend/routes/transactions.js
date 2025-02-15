const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Get all transactions for a user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get expenses only
router.get('/expenses', auth, async (req, res) => {
  try {
    const expenses = await Transaction.find({ 
      user: req.user.id,
      type: 'expense'
    }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get expenses summary
router.get('/expenses/summary', auth, async (req, res) => {
  try {
    const expenses = await Transaction.find({
      user: req.user.id,
      type: 'expense'
    });

    const summary = {
      total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      count: expenses.length,
      average: expenses.length ? 
        expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length : 0,
      byCategory: {}
    };

    // Group by category
    expenses.forEach(exp => {
      if (!summary.byCategory[exp.category]) {
        summary.byCategory[exp.category] = 0;
      }
      summary.byCategory[exp.category] += exp.amount;
    });

    res.json(summary);
  } catch (error) {
    console.error('Get expenses summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, category, amount, description, date, icon } = req.body;

    // Validate required fields
    if (!type || !category || !amount || !description) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate amount (remove the > 0 check since we want to allow negative numbers)
    if (amount === 0) {
      return res.status(400).json({ message: 'Amount cannot be zero' });
    }

    const transaction = new Transaction({
      user: req.user.id,
      type,
      category,
      amount,  // Store the amount as is (positive for income, negative for expense)
      description,
      date: date || Date.now(),
      icon
    });

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, category, amount, description, date, icon } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update fields
    transaction.type = type || transaction.type;
    transaction.category = category || transaction.category;
    transaction.amount = amount || transaction.amount;
    transaction.description = description || transaction.description;
    transaction.date = date || transaction.date;
    transaction.icon = icon || transaction.icon;

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add this new route to delete test expenses
router.delete('/cleanup/test', auth, async (req, res) => {
  try {
    const result = await Transaction.deleteMany({ 
      user: req.user.id,
      category: "Test Expense"
    });
    
    res.json({ 
      message: `Deleted ${result.deletedCount} test transactions`,
      count: result.deletedCount 
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 