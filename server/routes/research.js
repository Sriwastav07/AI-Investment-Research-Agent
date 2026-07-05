const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const researchService = require('../services/researchService');
const Report = require('../models/Report');
const SearchHistory = require('../models/SearchHistory');
const pdfGenerator = require('../pdf/pdfGenerator');

// SSE Research Stream
router.get('/stream', auth, async (req, res) => {
  const { companyName } = req.query;
  if (!companyName) return res.status(400).json({ message: 'Company name is required' });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendUpdate = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  req.on("close", () => {
  console.log("Client disconnected");
  });

  try {
    const report = await researchService.runResearch(companyName, req.user.id, sendUpdate);
    sendUpdate({ status: 'Completed', reportId: report._id, final: true });
    res.end();
  } catch (error) {
    console.error('Research error:', error);
    sendUpdate({ status: 'Error', message: error.message, error: true });
    res.end();
  }
});

// Get History
router.get('/history', auth, async (req, res) => {
  try {
    if (process.env.MOCK_MODE === 'true') {
        return res.json([]);
    }
    const history = await SearchHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Report by ID
router.get('/report/:id', auth, async (req, res) => {
  try {
    if (process.env.MOCK_MODE === 'true') {
        // Return a mock report if ID is mock_report_id
        return res.json({
            _id: req.params.id,
            companyName: 'Tesla',
            recommendation: 'INVEST',
            confidenceScore: 85,
            summary: 'Based on strong growth and sentiment.',
            details: {
                companyProfile: { symbol: 'TSLA', industry: 'Auto', hq: 'Austin', marketCap: '$800B' },
                financials: { revenue: '$96B', revenueGrowth: '18.8%', peRatio: '72', eps: '4.3', debtToEquity: '0.1', cashFlow: '$13B' },
                risks: [{category: 'Competition', level: 'High', description: 'Intense market competition.'}],
                swot: { strengths: ['Brand'], weaknesses: ['Price'], opportunities: ['AI'], threats: ['Regulation'] },
                sentiment: { summary: 'Positive' }
            },
            createdAt: new Date()
        });
    }
    const report = await Report.findOne({ _id: req.params.id, userId: req.user.id });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download PDF
router.get('/report/:id/pdf', auth, async (req, res) => {
  try {
    const pdfBytes = await pdfGenerator.generatePDF(req.params.id);
    res.contentType('application/pdf');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
