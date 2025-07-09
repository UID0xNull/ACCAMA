const express = require('express');
const router = express.Router();
const { sequelize, Withdrawal, Stock } = require('../models');
const { Op } = require('sequelize');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const PDFDocument = require('pdfkit');
const { createObjectCsvStringifier } = require('csv-writer');

// Withdrawals by month
router.get('/withdrawals/monthly', auth, role(['admin']), async (req, res) => {
  try {
    const data = await Withdrawal.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m')],
      order: [[sequelize.fn('DATE_FORMAT', sequelize.col('date'), '%Y-%m'), 'ASC']],
      raw: true
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Stock remaining by variety
router.get('/stock', auth, role(['admin']), async (req, res) => {
  try {
    const data = await Stock.findAll({
      attributes: ['variety', [sequelize.fn('SUM', sequelize.col('quantity')), 'total']],
      group: ['variety'],
      raw: true
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Active users (users with at least one withdrawal)
router.get('/users/active', auth, role(['admin']), async (req, res) => {
  try {
    const count = await Withdrawal.count({ distinct: true, col: 'userId' });
    res.json({ activeUsers: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export reports
router.get('/export/:type/:format', auth, role(['admin']), async (req, res) => {
  try {
    const { type, format } = req.params;
    let data;

    if (type === 'withdrawals') {
      data = await Withdrawal.findAll({ raw: true });
    } else if (type === 'stock') {
      data = await Stock.findAll({ raw: true });
    } else if (type === 'active-users') {
      const count = await Withdrawal.count({ distinct: true, col: 'userId' });
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
