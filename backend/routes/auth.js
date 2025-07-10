const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const prisma = require('../prismaClient');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const checkOng = require('../middlewares/ongMatchMiddleware');

// User registration
router.post('/register', auth, role(['admin_ong']), checkOng('ongId'), async (req, res) => {
  try {
    const { name, email, password, role: roleName, ongId } = req.body;
    if (!name || !email || !password || !roleName || !ongId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const roleRecord = await prisma.role.findUnique({ where: { name: roleName } });
    if (!roleRecord) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: { connect: { id: roleRecord.id } },
        ong: { connect: { id: parseInt(ongId) } },
      }
    });

    const token = jwt.sign(
      { id: user.id, role: roleRecord.name, ongId: user.ongId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role ? user.role.name : null, ongId: user.ongId },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
