const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const Report = require("../models/Report");

exports.generatePDF = async (reportId) => {
  let report;

  if (process.env.MOCK_MODE === "true") {
    report = {
      companyName: "Amazon",
      recommendation: "INVEST",
      confidenceScore: 86,
      investmentHorizon: "Long Term",
      riskLevel: "Medium",
      summary: "Amazon has strong fundamentals, healthy profitability and positive long-term growth prospects.",
      pros: [
        "Strong market leadership",
        "Consistent revenue growth",
        "Diversified business model"
      ],
      cons: [
        "High valuation",
        "Retail competition"
      ],
      details: {
        companyProfile: {
          symbol: "AMZN",
          industry: "Retail",
          headquarters: "Seattle, USA"
        },
        financials: {
          peRatio: 28.7,
          eps: 8.36,
          beta: 1.47,
          currentRatio: 1.17,
          debtToEquity: "N/A",
          marketCap: 2610427
        },
        sentiment: {
          summary: "Positive",
          score: 80
        },
        competitors: [
          "Walmart",
          "Target",
          "Costco"
        ],
        risks: [
          {
            category: "Valuation",
            level: "Medium",
            description: "Relatively expensive compared to peers."
          }
        ]
      },
      createdAt: new Date()
    };
  } else {
    report = await Report.findById(reportId);
  }

  if (!report) {
    throw new Error("Report not found");
  }

  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([595, 842]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;

  const write = (text, size = 12, isBold = false) => {

    page.drawText(String(text), {
      x: 50,
      y,
      size,
      font: isBold ? bold : font,
      color: rgb(0, 0, 0)
    });

    y -= size + 8;

  };

  write("AI Investment Research Report", 22, true);

  y -= 10;

  write(`Company : ${report.companyName}`, 15, true);

  write(
    `Symbol : ${report.details.companyProfile.symbol || "N/A"}`
  );

  write(
    `Industry : ${report.details.companyProfile.industry || "N/A"}`
  );

  write(
    `Recommendation : ${report.recommendation}`,
    14,
    true
  );

  write(`Confidence : ${report.confidenceScore}%`);

  write(`Risk Level : ${report.riskLevel}`);

  write(`Investment Horizon : ${report.investmentHorizon}`);

  y -= 15;

  write("AI Reasoning", 16, true);

  const lines =
    (report.summary || "").match(/.{1,85}(\s|$)/g) || [];

  for (const line of lines) {
    write(line.trim());
  }

  y -= 10;

  write("Financial Metrics", 16, true);

  const f = report.details.financials || {};

  write(`P/E Ratio : ${f.peRatio ?? "N/A"}`);

  write(`EPS : ${f.eps ?? "N/A"}`);

  write(`Beta : ${f.beta ?? "N/A"}`);

  write(`Current Ratio : ${f.currentRatio ?? "N/A"}`);

  write(`Debt / Equity : ${f.debtToEquity ?? "N/A"}`);

  write(`Market Cap : ${f.marketCap ?? "N/A"}`);

  y -= 10;

  write("Market Sentiment", 16, true);

  write(
    `${report.details.sentiment.summary || "Neutral"} (${report.details.sentiment.score ?? 50})`
  );

  y -= 10;

  write("Competitors", 16, true);

  (report.details.competitors || []).forEach(c => {
    write("• " + c);
  });

  y -= 10;

  write("Risks", 16, true);

  (report.details.risks || []).forEach(r => {

    write(`${r.category} (${r.level})`);

    write(r.description);

  });

  y -= 10;

  write("Pros", 16, true);

  (report.pros || []).forEach(p => write("• " + p));

  y -= 10;

  write("Cons", 16, true);

  (report.cons || []).forEach(c => write("• " + c));

  y -= 10;

  write("SWOT Analysis", 16, true);

  const swot = report.details.swot || {};

  write("Strengths", 14, true);
  (swot.strengths || []).forEach(s => write("• " + s));

  write("Weaknesses", 14, true);
  (swot.weaknesses || []).forEach(s => write("• " + s));

  write("Opportunities", 14, true);
  (swot.opportunities || []).forEach(s => write("• " + s));

  write("Threats", 14, true);
  (swot.threats || []).forEach(s => write("• " + s));

  page.drawText(
    `Generated on ${new Date(report.createdAt).toLocaleString()}`,
    {
      x: 50,
      y: 25,
      size: 10,
      font
    }
  );

  return await pdfDoc.save();
};