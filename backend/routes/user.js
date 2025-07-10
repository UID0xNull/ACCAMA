const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

// List users with filters and pagination
router.get('/', auth, role(['admin', 'admin_ong']), async (req, res) => {
  try {
    const { page = 1, limit = 10, name, email, roleId, ongId } = req.query;
    const where = {};
    if (name) where.name = { contains: name };
    if (email) where.email = { contains: email };
    if (roleId) where.roleId = parseInt(roleId);
    if (req.user.role !== 'admin') {
      where.ongId = req.user.ongId;
    } else if (ongId) {
      where.ongId = ongId;
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { role: true },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.user.count({ where })
    ]);

    res.json({ data, total, page: parseInt(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
