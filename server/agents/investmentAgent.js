const aiService = require("../services/aiService");

exports.run = async (state) => {

  try {

    const result = await aiService.generateInvestmentDecision({

      companyProfile: state.companyProfile,

      financials: state.financials,

      news: state.news,

      sentiment: state.sentiment,

      competitors: state.competitors,

      risks: state.risks

    });

    return {

      recommendation: result.recommendation || "HOLD",

      confidenceScore: result.confidence || 50,

      reasoning: result.reason || "No reasoning generated.",

      riskLevel: result.riskLevel || "Medium",

      investmentHorizon:
        result.investmentHorizon || "Long Term",

      pros: result.pros || [],

      cons: result.cons || [],

      swot: {

        strengths: result.strengths || [],

        weaknesses: result.weaknesses || [],

        opportunities: result.opportunities || [],

        threats: result.threats || []

      }

    };

  } catch (err) {

    console.log("Investment Agent:", err.message);

    return {

      recommendation: "HOLD",

      confidenceScore: 50,

      reasoning: "Unable to generate AI recommendation.",

      riskLevel: "Unknown",

      investmentHorizon: "Unknown",

      pros: [],

      cons: [],

      swot: {

        strengths: [],

        weaknesses: [],

        opportunities: [],

        threats: []

      }

    };

  }

};