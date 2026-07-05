const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const finnhub = require("../utils/finnhub");

module.exports = tool(
  async ({ companyName }) => {
    // Search company symbol
    const search = await finnhub.get("/search", {
      params: {
        q: companyName,
      },
    });

    if (!search.data.result || search.data.result.length === 0) {
      throw new Error("Company not found");
    }

    // Pick first common stock
    const company =
      search.data.result.find((c) => c.type === "Common Stock") ||
      search.data.result[0];

    const symbol = company.symbol;

    // Get company profile
    const profile = await finnhub.get("/stock/profile2", {
      params: {
        symbol,
      },
    });

    const data = profile.data;

    return {
      symbol: data.ticker,
      companyName: data.name,
      industry: data.finnhubIndustry,
      sector: data.finnhubIndustry,
      description: "",
      headquarters: data.country,
      country: data.country,
      ceo: "",
      founded: data.ipo,
      employees: "",
      website: data.weburl,
      exchange: data.exchange,
      marketCap: data.marketCapitalization,
      logo: data.logo,
      phone: data.phone,
    };
  },
  {
    name: "company_profile_tool",
    description: "Returns company profile.",
    schema: z.object({
      companyName: z.string(),
    }),
  }
);