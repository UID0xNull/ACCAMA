const express = require('express');
const router = express.Router();

const prisma = require('../prismaClient');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const checkOng = require('../middlewares/ongMatchMiddleware');

// Create withdrawal request
router.post('/', auth, checkOng('ongId'), async (req, res) => {
  try {
    const { amount, variety, reason } = req.body;
    const ongId = req.user.ongId;
    if (!amount || !variety || !ongId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const stock = await prisma.stock.findFirst({ where: { ongId, variety } });
    if (!stock || parseFloat(stock.quantity) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    await prisma.stock.update({
      where: { id: stock.id },
      data: { quantity: stock.quantity - parseFloat(amount) }
    });

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: req.user.id,
        ongId,
        amount: parseFloat(amount),
        variety,
        reason
      }
    });

    res.status(201).json(withdrawal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update withdrawal status (admin only)
router.put('/:id', auth, role(['admin_ong']), async (req, res) => {
  try {
    const { status } = req.body;
    const withdrawal = await prisma.withdrawal.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!withdrawal) return res.status(404).json({ error: 'Not found' });
    if (parseInt(withdrawal.ongId) !== parseInt(req.user.ongId)) {
      return res.status(403).json({ error: 'ONG mismatch' });
    }

    if (status === 'rechazado' && withdrawal.status === 'pendiente') {
      const stock = await prisma.stock.findFirst({ where: { ongId: withdrawal.ongId, variety: withdrawal.variety } });
      if (stock) {
        await prisma.stock.update({
          where: { id: stock.id },
          data: { quantity: stock.quantity + withdrawal.amount }
        });
      }
    }

    const updated = await prisma.withdrawal.update({ where: { id: withdrawal.id }, data: { status } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get withdrawal history
router.get('/', auth, checkOng('ongId'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, userId, ongId } = req.query;
    const where = {};

    if (req.user.role !== 'admin_ong') {
      where.userId = req.user.id;
      where.ongId = req.user.ongId;
    } else {
      if (userId) where.userId = userId;
      if (ongId) where.ongId = ongId;
    }
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.withdrawal.count({ where })
    ]);

    res.json({ data, total, page: parseInt(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
