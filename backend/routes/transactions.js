const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// Get transactions with filters
router.get('/', auth, async (req, res) => {
  try {
    const {
      dateRange,
      startDate,
      endDate,
      category,
      searchQuery,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    let query = { user: req.user.id };

    // Date filtering
    if (dateRange && dateRange !== 'all') {
      const today = new Date();
      let startDateTime;

      switch (dateRange) {
        case 'week':
          startDateTime = new Date(today.setDate(today.getDate() - 7));
          query.date = { $gte: startDateTime };
          break;
        case 'month':
          startDateTime = new Date(today.setMonth(today.getMonth() - 1));
          query.date = { $gte: startDateTime };
          break;
        case 'custom':
          if (startDate && endDate) {
            query.date = {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            };
          }
          break;
      }
    }

    // Category filtering
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search query
    if (searchQuery) {
      query.$or = [
        { description: { $regex: searchQuery, $options: 'i' } },
        { category: { $regex: searchQuery, $options: 'i' } }
      ];
    }

    // Build sort object
    let sortOptions = {};
    switch (sortBy) {
      case 'date':
        sortOptions.date = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'amount':
        sortOptions.amount = sortOrder === 'asc' ? 1 : -1;
        break;
      case 'category':
        sortOptions.category = sortOrder === 'asc' ? 1 : -1;
        break;
      default:
        sortOptions.date = -1;
    }

    // Execute query with filters and sorting
    const transactions = await Transaction.find(query)
      .sort(sortOptions)
      .exec();

    // Calculate summary with proper date handling
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    const summary = {
      total: transactions.reduce((sum, t) => sum + t.amount, 0),
      count: transactions.length,
      today: transactions.filter(t => {
        const txDate = new Date(t.date);
        txDate.setHours(0, 0, 0, 0);
        return txDate.getTime() === today.getTime() && t.type === 'expense';
      }).reduce((sum, t) => sum + Math.abs(t.amount), 0),
      thisMonth: transactions.filter(t =>
        new Date(t.date).getMonth() === today.getMonth() && t.type === 'expense'
      ).reduce((sum, t) => sum + Math.abs(t.amount), 0),
      byCategory: {}
    };

    // Group by category
    transactions.forEach(t => {
      if (!summary.byCategory[t.category]) {
        summary.byCategory[t.category] = {
          count: 0,
          total: 0
        };
      }
      summary.byCategory[t.category].count++;
      summary.byCategory[t.category].total += t.amount;
    });

    res.json({
      transactions,
      summary
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// Get available categories
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await Transaction.distinct('category', {
      user: req.user.id
    });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const stats = await Transaction.aggregate([
      { $match: { user: req.user.id } },
      {
        $facet: {
          today: [
            {
              $match: {
                date: {
                  $gte: new Date(today.setHours(0, 0, 0, 0)),
                  $lt: new Date(today.setHours(23, 59, 59, 999))
                }
              }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ],
          thisMonth: [
            { $match: { date: { $gte: firstDayOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ],
          average: [
            { $group: { _id: null, avg: { $avg: '$amount' } } }
          ]
        }
      }
    ]);

    res.json({
      today: stats[0].today[0]?.total || 0,
      thisMonth: stats[0].thisMonth[0]?.total || 0,
      average: stats[0].average[0]?.avg || 0
    });

  } catch (error) {
    console.error('Get stats error:', error);
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
      amount: Math.abs(amount), // Always store positive amounts
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

// Add this inside your existing routes
router.get('/trends', auth, async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    
    const transactions = await Transaction.find({
      user: req.user.id,
      date: { $gte: sixMonthsAgo }
    });

    // Group by month
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          expenses: 0,
          income: 0
        };
      }

      if (transaction.type === 'expense') {
        acc[monthYear].expenses += Math.abs(transaction.amount);
      } else {
        acc[monthYear].income += transaction.amount;
      }

      return acc;
    }, {});

    res.json(monthlyData);
  } catch (error) {
    console.error('Get trends error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 