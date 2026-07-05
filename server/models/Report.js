const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  companyName: {
    type: String,
    required: true,
  },

  summary: {
    type: String,
  },

  recommendation: {
    type: String,
    enum: ["INVEST", "HOLD", "PASS"],
    required: true,
  },

  confidenceScore: {
    type: Number,
    min: 0,
    max: 100,
  },

  // ⭐ New Fields
  investmentHorizon: {
    type: String,
    default: "Unknown",
  },

  riskLevel: {
    type: String,
    enum: ["Low", "Medium", "High", "Unknown"],
    default: "Unknown",
  },

  pros: {
    type: [String],
    default: [],
  },

  cons: {
    type: [String],
    default: [],
  },

  details: {
    companyProfile: {
      type: Object,
      default: {},
    },

    financials: {
      type: Object,
      default: {},
    },

    news: {
      type: [Object],
      default: [],
    },

    sentiment: {
      type: Object,
      default: {},
    },

    competitors: {
      type: [String],
      default: [],
    },

    risks: {
      type: [Object],
      default: [],
    },

    swot: {
      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      opportunities: {
        type: [String],
        default: [],
      },

      threats: {
        type: [String],
        default: [],
      },
    },

    reasoning: {
      type: String,
      default: "",
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);