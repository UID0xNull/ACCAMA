const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();

const prisma = require('../prismaClient');
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
    const patient = await prisma.user.findUnique({ where: { id: parseInt(patientId) } });
    if (!patient || parseInt(patient.ongId) !== parseInt(req.user.ongId)) {
      return res.status(403).json({ error: 'ONG mismatch' });
    }

    const record = await prisma.legalRecord.create({
      data: {
        patientId: parseInt(patientId),
        type,
        date: date ? new Date(date) : new Date(),
        path: req.file ? req.file.filename : null,
        ongId: req.user.ongId,
      }
    });

    await prisma.user.update({ where: { id: patient.id }, data: { legalStatus: type } });

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

    // Patients can only access their own records
    if (req.user.role === 'paciente' && parseInt(patientId) !== parseInt(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const patient = await prisma.user.findUnique({ where: { id: parseInt(patientId) } });
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    if (req.user.role !== 'admin' && parseInt(patient.ongId) !== parseInt(req.user.ongId)) {
      return res.status(403).json({ error: 'ONG mismatch' });
    }

    const list = await prisma.legalRecord.findMany({ where: { patientId: parseInt(patientId) } });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
