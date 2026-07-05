const { StateGraph, END } = require("@langchain/langgraph");

const profileTool = require("../tools/profile");
const financialsTool = require("../tools/financials");
const newsTool = require("../tools/news");
const sentimentTool = require("../tools/sentiment");
const competitorsTool = require("../tools/competitors");
const risksTool = require("../tools/risks");

const aiService = require("../services/aiService");

// ----------------------
// Graph State
// ----------------------

const InvestState = {
  companyName: { value: (x, y) => y ?? x, default: () => "" },

  companyProfile: { value: (x, y) => y ?? x, default: () => ({}) },

  financials: { value: (x, y) => y ?? x, default: () => ({}) },

  news: { value: (x, y) => y ?? x, default: () => [] },

  sentiment: { value: (x, y) => y ?? x, default: () => ({}) },

  competitors: { value: (x, y) => y ?? x, default: () => [] },

  risks: { value: (x, y) => y ?? x, default: () => [] },

  recommendation: { value: (x, y) => y ?? x, default: () => "" },

  reasoning: { value: (x, y) => y ?? x, default: () => "" },

  confidenceScore: { value: (x, y) => y ?? x, default: () => 0 },

  swot: { value: (x, y) => y ?? x, default: () => ({}) },

  status: { value: (x, y) => y ?? x, default: () => "" }
};

// ----------------------
// Research Node
// ----------------------

const researchNode = async (state) => {
  try {
    const profile = await profileTool.invoke({
      companyName: state.companyName,
    });

    return {
      companyProfile: profile,
      status: "🔍 Company profile collected",
    };
  } catch (err) {
    console.error("Profile Error:", err.message);

    return {
      companyProfile: {},
      status: "⚠ Company profile unavailable",
    };
  }
};

// ----------------------
// Financial Node
// ----------------------

const financialNode = async (state) => {
  try {
    const financials = await financialsTool.invoke({
      companyName: state.companyName,
    });

    return {
      financials,
      status: "📈 Financial data collected",
    };
  } catch (err) {
    console.error("Financial Error:", err.message);

    return {
      financials: {},
      status: "⚠ Financial data unavailable",
    };
  }
};

// ----------------------
// News Node
// ----------------------

const newsNode = async (state) => {
  try {
    const news = await newsTool.invoke({
      companyName: state.companyName,
    });

    return {
      news,
      status: "📰 Latest news collected",
    };
  } catch (err) {
    console.error("News Error:", err.message);

    return {
      news: [],
      status: "⚠ News unavailable",
    };
  }
};

// ----------------------
// Sentiment Node
// ----------------------

const sentimentNode = async (state) => {
  try {
    const sentiment = await sentimentTool.invoke({
      companyName: state.companyName,
      newsContext: JSON.stringify(state.news),
    });

    return {
      sentiment,
      status: "😊 Market sentiment analyzed",
    };
  } catch (err) {
    console.error("Sentiment Error:", err.message);

    return {
      sentiment: {
        sentiment: "Neutral",
        score: 50,
        summary: "Unable to analyze sentiment.",
      },
      status: "⚠ Sentiment unavailable",
    };
  }
};

// ----------------------
// Competitor Node
// ----------------------

const competitorNode = async (state) => {
  try {
    const competitors = await competitorsTool.invoke({
      companyName: state.companyName,
      industry: state.companyProfile?.industry || "",
    });

    return {
      competitors,
      status: "⚔ Competitor analysis completed",
    };
  } catch (err) {
    console.error("Competitor Error:", err.message);

    return {
      competitors: [],
      status: "⚠ Competitor data unavailable",
    };
  }
};

// ----------------------
// Risk Node
// ----------------------

const riskNode = async (state) => {
  try {
    const risks = await risksTool.invoke({
      companyName: state.companyName,
      financials: JSON.stringify(state.financials),
      industry: state.companyProfile?.industry || "",
    });

    return {
      risks,
      status: "⚠ Risk analysis completed",
    };
  } catch (err) {
    console.error("Risk Error:", err.message);

    return {
      risks: [],
      status: "⚠ Risk analysis unavailable",
    };
  }
};

// ----------------------
// AI Decision Node
// ----------------------

const decisionNode = async (state) => {
  try {
    const result = await aiService.generateInvestmentDecision({
      companyProfile: state.companyProfile,
      financials: state.financials,
      news: state.news,
      sentiment: state.sentiment,
      competitors: state.competitors,
      risks: state.risks,
    });

    return {
      recommendation: result.recommendation,

      confidenceScore: result.confidence,

      reasoning: result.reason,

      swot: {
        strengths: result.strengths || [],
        weaknesses: result.weaknesses || [],
        opportunities: result.opportunities || [],
        threats: result.threats || [],
      },

      status: "🤖 AI recommendation generated",
    };
  } catch (err) {
    console.error("Decision Error:", err.message);

    return {
      recommendation: "HOLD",

      confidenceScore: 50,

      reasoning:
        "The AI could not generate a reliable recommendation due to missing or incomplete data.",

      swot: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
        threats: [],
      },

      status: "⚠ AI recommendation unavailable",
    };
  }
};

// ----------------------
// Build Workflow
// ----------------------

const workflow = new StateGraph({
  channels: InvestState,
})
  .addNode("node_research", researchNode)
  .addNode("node_financials", financialNode)
  .addNode("node_news", newsNode)
  .addNode("node_sentiment", sentimentNode)
  .addNode("node_competitors", competitorNode)
  .addNode("node_risks", riskNode)
  .addNode("node_decision", decisionNode)

  .addEdge("__start__", "node_research")
  .addEdge("node_research", "node_financials")
  .addEdge("node_financials", "node_news")
  .addEdge("node_news", "node_sentiment")
  .addEdge("node_sentiment", "node_competitors")
  .addEdge("node_competitors", "node_risks")
  .addEdge("node_risks", "node_decision")
  .addEdge("node_decision", END);

const app = workflow.compile();

module.exports = app;