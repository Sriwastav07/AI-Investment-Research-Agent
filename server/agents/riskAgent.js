exports.run = async (state) => {

  const f = state.financials || {};

  const sentiment = state.sentiment || {};

  const risks = [];

  if (f.peRatio && f.peRatio > 40) {

    risks.push({

      category: "Valuation",

      level: "High",

      description: "High P/E ratio indicates an expensive stock."

    });

  }

  if (f.currentRatio && f.currentRatio < 1) {

    risks.push({

      category: "Liquidity",

      level: "Medium",

      description: "Current ratio below 1."

    });

  }

  if (f.debtToEquity && f.debtToEquity > 2) {

    risks.push({

      category: "Debt",

      level: "High",

      description: "High debt compared to equity."

    });

  }

  if (sentiment.summary === "Negative") {

    risks.push({

      category: "Market",

      level: "Medium",

      description: "Recent news sentiment is negative."

    });

  }

  return {

    risks

  };

};