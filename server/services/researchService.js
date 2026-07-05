const supervisorAgent = require("../agents/supervisorAgent");

const Report = require("../models/Report");
const SearchHistory = require("../models/SearchHistory");

exports.runResearch = async (companyName, userId, onUpdate) => {

  // Run the complete AI workflow
  const finalState = await supervisorAgent.run(
    companyName,
    onUpdate
  );

  console.log("\n========== FINAL STATE ==========");
  console.dir(finalState, { depth: null });
  
  const reportData = {
  userId,

  companyName,

  recommendation: finalState.recommendation || "HOLD",

  confidenceScore: finalState.confidenceScore ?? 50,

  investmentHorizon: finalState.investmentHorizon || "Unknown",

  riskLevel: finalState.riskLevel || "Unknown",

  pros: finalState.pros || [],

  cons: finalState.cons || [],

  summary: finalState.reasoning || "",

  details: {
    companyProfile: finalState.companyProfile || {},

    financials: finalState.financials || {},

    news: finalState.news || [],

    sentiment: finalState.sentiment || {
      summary: "Neutral",
      score: 50,
    },

    competitors: finalState.competitors || [],

    risks: finalState.risks || [],

    swot: finalState.swot || {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    },

    reasoning: finalState.reasoning || "",
  },
};

  let report;

  if (process.env.MOCK_MODE === "true") {

    report = {

      ...reportData,

      _id: "mock_report_id",

      createdAt: new Date()

    };

  } else {

    report = new Report(reportData);

    await report.save();

    await new SearchHistory({

      userId,

      companyName,

      reportId: report._id

    }).save();

  }

  return report;

};