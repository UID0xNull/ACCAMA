const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const checkOng = require('../middlewares/ongMatchMiddleware');
const PDFDocument = require('pdfkit');
const { createObjectCsvStringifier } = require('csv-writer');

// Withdrawals by month
router.get('/withdrawals/monthly', auth, role(['admin', 'admin_ong']), checkOng('ongId'), async (req, res) => {
  try {
    const where = {};
    if (req.user.role !== 'admin') {
      where.ongId = req.user.ongId;
    }

    const condition = where.ongId ? 'WHERE ongId = ?' : '';
    const data = await prisma.$queryRawUnsafe(
      `SELECT DATE_FORMAT(date, '%Y-%m') as month, COUNT(id) as count FROM Withdrawal ${condition} GROUP BY month ORDER BY month ASC`,
      ...(where.ongId ? [where.ongId] : [])
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Stock remaining by variety
router.get('/stock', auth, role(['admin', 'admin_ong']), checkOng('ongId'), async (req, res) => {
  try {
    const where = {};
    if (req.user.role !== 'admin') {
      where.ongId = req.user.ongId;
    }

    const condition = where.ongId ? 'WHERE ongId = ?' : '';
    const data = await prisma.$queryRawUnsafe(
      `SELECT variety, SUM(quantity) as total FROM Stock ${condition} GROUP BY variety`,
      ...(where.ongId ? [where.ongId] : [])
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Active users (users with at least one withdrawal)
router.get('/users/active', auth, role(['admin', 'admin_ong']), checkOng('ongId'), async (req, res) => {
  try {
    const where = {};
    if (req.user.role !== 'admin') {
      where.ongId = req.user.ongId;
    }

    const count = await prisma.withdrawal.count({ where, distinct: 'userId' });
    res.json({ activeUsers: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export reports
router.get('/export/:type/:format', auth, role(['admin', 'admin_ong']), checkOng('ongId'), async (req, res) => {
  try {
    const { type, format } = req.params;
    let data;

    const where = {};
    if (req.user.role !== 'admin') {
      where.ongId = req.user.ongId;
    }

    if (type === 'withdrawals') {
      data = await prisma.withdrawal.findMany({ where });
    } else if (type === 'stock') {
      data = await prisma.stock.findMany({ where });
    } else if (type === 'active-users') {
      const count = await prisma.withdrawal.count({ where, distinct: 'userId' });
      data = [{ activeUsers: count }];
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    if (format === 'csv') {
      const headers = Object.keys(data[0] || {}).map(key => ({ id: key, title: key }));
      const csvStringifier = createObjectCsvStringifier({ header: headers });
      const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data);
      res.type('text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
      return res.send(csv);
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);
      data.forEach(row => {
        doc.text(JSON.stringify(row));
        doc.moveDown();
      });
      doc.end();
    } else {
      return res.status(400).json({ error: 'Invalid format' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
