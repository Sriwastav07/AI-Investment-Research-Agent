module.exports = (state) => `
You are a senior CFA investment analyst.

Company Profile:
${JSON.stringify(state.companyProfile, null, 2)}

Financials:
${JSON.stringify(state.financials, null, 2)}

News:
${JSON.stringify(state.news, null, 2)}

Sentiment:
${JSON.stringify(state.sentiment, null, 2)}

Competitors:
${JSON.stringify(state.competitors, null, 2)}

Risks:
${JSON.stringify(state.risks, null, 2)}

Return ONLY valid JSON:

{
  "recommendation":"INVEST or PASS",
  "confidenceScore":0,
  "reasoning":"Explain your decision in detail.",
  "swot":{
    "strengths":[],
    "weaknesses":[],
    "opportunities":[],
    "threats":[]
  }
}
`;