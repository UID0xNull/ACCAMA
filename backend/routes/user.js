const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { User, Role } = require('../models');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

// List users with filters and pagination (admin only)
router.get('/', auth, role(['admin_ong']), async (req, res) => {
  try {
    const { page = 1, limit = 10, name, email, roleId } = req.query;
    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    if (roleId) where.roleId = roleId;

    const result = await User.findAndCountAll({
      where,
      include: Role,
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
