const express = require('express');
const path = require('path');
const multer = require('multer');
const { ONG } = require('../models');
const { Op } = require('sequelize');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// List ONGs with filters and pagination (admin only)
router.get('/', auth, role(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, name } = req.query;
    const where = {};
    if (status) where.status = status;
    if (name) where.name = { [Op.like]: `%${name}%` };

    const result = await ONG.findAndCountAll({
      where,
      offset: (parseInt(page) - 1) * parseInt(limit),
      limit: parseInt(limit)
    });

    res.json({ data: result.rows, total: result.count, page: parseInt(page) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Register ONG (admin only)
router.post('/', auth, role(['admin']), upload.fields([{ name: 'statute', maxCount: 1 }, { name: 'documents', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, description, phone, email, address } = req.body;
    const statute = req.files['statute'] ? req.files['statute'][0].filename : null;
    const documents = req.files['documents'] ? req.files['documents'][0].filename : null;
    const ong = await ONG.create({ name, description, phone, email, address, statute, documents });
    res.status(201).json(ong);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get pending ONGs (admin only)
router.get('/pending', auth, role(['admin']), async (req, res) => {
  try {
    const list = await ONG.findAll({ where: { status: 'pendiente' } });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve ONG (admin only)
router.post('/:id/approve', auth, role(['admin']), async (req, res) => {
  try {
    const ong = await ONG.findByPk(req.params.id);
    if (!ong) return res.status(404).json({ error: 'Not found' });
    ong.status = 'aprobada';
    await ong.save();
    res.json(ong);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject ONG (admin only)
router.post('/:id/reject', auth, role(['admin']), async (req, res) => {
  try {
    const ong = await ONG.findByPk(req.params.id);
    if (!ong) return res.status(404).json({ error: 'Not found' });
    ong.status = 'rechazada';
    await ong.save();
    res.json(ong);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
