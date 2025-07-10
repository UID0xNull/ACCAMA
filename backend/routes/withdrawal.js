const express = require('express');
const router = express.Router();

const { Withdrawal, Stock } = require('../models');
const { Op } = require('sequelize');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

// Create withdrawal request
router.post('/', auth, async (req, res) => {
  try {
    const { amount, variety, reason } = req.body;
    const ongId = req.user.ongId;
    if (!amount || !variety || !ongId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const stock = await Stock.findOne({ where: { ongId, variety } });
    if (!stock || parseFloat(stock.quantity) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    stock.quantity = parseFloat(stock.quantity) - parseFloat(amount);
    await stock.save();

    const withdrawal = await Withdrawal.create({
      userId: req.user.id,
      ongId,
      amount,
      variety,
      reason,
    });

    res.status(201).json(withdrawal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update withdrawal status (admin only)
router.put('/:id', auth, role(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const withdrawal = await Withdrawal.findByPk(req.params.id);
    if (!withdrawal) return res.status(404).json({ error: 'Not found' });

    if (status === 'rechazado' && withdrawal.status === 'pendiente') {
      const stock = await Stock.findOne({ where: { ongId: withdrawal.ongId, variety: withdrawal.variety } });
      if (stock) {
        stock.quantity = parseFloat(stock.quantity) + parseFloat(withdrawal.amount);
        await stock.save();
      }
    }

    withdrawal.status = status;
    await withdrawal.save();
    res.json(withdrawal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get withdrawal history
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId, ongId } = req.query;
    const where = {};

    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
      where.ongId = req.user.ongId;
    } else {
      if (userId) where.userId = userId;
      if (ongId) where.ongId = ongId;
    }
    if (status) where.status = status;

    const result = await Withdrawal.findAndCountAll({
      where,
      order: [['date', 'DESC']],
      offset: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit)
    });

    res.json({ data: result.rows, total: result.count, page: parseInt(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
