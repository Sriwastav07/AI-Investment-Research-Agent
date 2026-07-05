const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const finnhub = require("../utils/finnhub");

function findValue(arr, keywords) {
  if (!Array.isArray(arr)) return null;

  for (const item of arr) {
    const label = (
      item.label ||
      item.concept ||
      item.account ||
      ""
    ).toLowerCase();

    if (keywords.some((k) => label.includes(k.toLowerCase()))) {
      return item.value ?? null;
    }
  }

  return null;
}

module.exports = tool(
  async ({ companyName }) => {

    // Search Company
    const search = await finnhub.get("/search", {
      params: {
        q: companyName,
      },
    });

    if (!search.data.result.length) {
      throw new Error("Company not found");
    }

    const company =
      search.data.result.find((c) => c.type === "Common Stock") ||
      search.data.result[0];

    const symbol = company.symbol;

    // Basic Metrics
    const metricRes = await finnhub.get("/stock/metric", {
      params: {
        symbol,
        metric: "all",
      },
    });

    const metric = metricRes.data.metric || {};

    // Financial Statements
    const financialRes = await finnhub.get("/stock/financials-reported", {
      params: {
        symbol,
      },
    });

    let latest = {};

    if (
      financialRes.data.data &&
      financialRes.data.data.length > 0
    ) {
      latest = financialRes.data.data[0];
    }

    let revenue = null;
    let netIncome = null;
    let cashFlow = null;

    if (latest.report) {

      const income = latest.report.ic || [];

      const cash = latest.report.cf || [];

      revenue = findValue(income, [
        "revenue",
        "sales",
        "total revenue"
      ]);

      netIncome = findValue(income, [
        "net income",
        "profit"
      ]);

      cashFlow = findValue(cash, [
        "operating activities"
      ]);
    }

  //   if (latest.report?.cf) {
  //   console.log("\n===== CASH FLOW LABELS =====");

  //   latest.report.cf.forEach(item => {
  //   console.log(item.label || item.concept || item.account);
  //   });
  // }

    return {

      symbol,

      peRatio:
        metric.peBasicExclExtraTTM ??
        metric.peTTM ??
        null,

      eps:
        metric.epsTTM ??
        null,

      marketCap:
        metric.marketCapitalization ??
        null,

      week52High:
        metric["52WeekHigh"] ??
        null,

      week52Low:
        metric["52WeekLow"] ??
        null,

      beta:
        metric.beta ??
        null,

      dividendYield:
        metric.dividendYieldIndicatedAnnual ??
        null,

      roe:
        metric.roeTTM ??
        null,

      roa:
        metric.roaTTM ??
        null,

      currentRatio:
        metric.currentRatioQuarterly ??
        null,

      debtToEquity:
        metric.totalDebtToEquityQuarterly ??
        null,

      operatingMargin:
        metric.operatingMarginTTM ??
        null,

      netMargin:
        metric.netMarginTTM ??
        null,

      // New fields for chart
      revenue,

      netIncome,

      cashFlow,

      financialReport: latest
    };
  },

  {
    name: "financial_tool",

    description: "Returns company financial metrics.",

    schema: z.object({
      companyName: z.string(),
    }),
  }
);