const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

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

// Associate patient with doctor
router.post('/', auth, role(['doctor']), async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!patientId) return res.status(400).json({ error: 'Missing patientId' });

    const patient = await prisma.user.findUnique({ where: { id: parseInt(patientId) } });
    if (!patient || parseInt(patient.ongId) !== parseInt(req.user.ongId)) {
      return res.status(403).json({ error: 'ONG mismatch' });
    }

    await prisma.doctorPatient.upsert({
      where: { doctorId_patientId: { doctorId: req.user.id, patientId: parseInt(patientId) } },
      create: { doctorId: req.user.id, patientId: parseInt(patientId), ongId: req.user.ongId },
      update: {}
    });
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List patients of the logged doctor
router.get('/', auth, role(['doctor']), async (req, res) => {
  try {
    const relations = await prisma.doctorPatient.findMany({
      where: { doctorId: req.user.id },
      include: { Patient: true }
    });
    const list = relations.map(r => r.Patient);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update authorized use for a patient
router.put('/:id/use', auth, role(['doctor']), async (req, res) => {
  try {
    const patient = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!patient) return res.status(404).json({ error: 'Not found' });
    if (parseInt(patient.ongId) !== parseInt(req.user.ongId)) {
      return res.status(403).json({ error: 'ONG mismatch' });
    }
    const updated = await prisma.user.update({ where: { id: patient.id }, data: { authorizedUse: req.body.authorizedUse } });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload medical document for patient
router.post('/medical-docs', auth, role(['doctor']), upload.single('file'), async (req, res) => {
  try {
    const { patientId, title } = req.body;
    if (!patientId || !req.file || !title) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const patient = await prisma.user.findUnique({ where: { id: parseInt(patientId) } });
    if (!patient || parseInt(patient.ongId) !== parseInt(req.user.ongId)) {
      return res.status(403).json({ error: 'ONG mismatch' });
    }
    const doc = await prisma.medicalDoc.create({
      data: {
        doctorId: req.user.id,
        patientId: parseInt(patientId),
        title,
        path: req.file.filename,
        ongId: req.user.ongId,
      }
    });
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
