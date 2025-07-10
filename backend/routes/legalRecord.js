const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();

const { LegalRecord, User } = require('../models');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const checkOng = require('../middlewares/ongMatchMiddleware');

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

// Upload legal document
router.post('/', auth, role(['doctor']), upload.single('file'), async (req, res) => {
  try {
    const { patientId, type, date } = req.body;
    if (!patientId || !type) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const patient = await User.findByPk(patientId);
    if (!patient || parseInt(patient.ongId) !== parseInt(req.user.ongId)) {
      return res.status(403).json({ error: 'ONG mismatch' });
    }

    const record = await LegalRecord.create({
      patientId,
      type,
      date: date || new Date(),
      path: req.file ? req.file.filename : null,
      ongId: req.user.ongId,
    });

    patient.legalStatus = type;
    await patient.save();

    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get legal records for patient
router.get('/:patientId', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await User.findByPk(patientId);
    if (!patient || parseInt(patient.ongId) !== parseInt(req.user.ongId)) {
      return res.status(403).json({ error: 'ONG mismatch' });
    }
    const list = await LegalRecord.findAll({ where: { patientId } });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
