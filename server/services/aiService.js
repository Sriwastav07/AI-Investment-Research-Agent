const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.3,
});

function extractJSON(text) {

  text = text.replace(/```json/g, "");
  text = text.replace(/```/g, "").trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start !== -1 && end !== -1) {
    return JSON.parse(text.substring(start, end + 1));
  }

  throw new Error("Invalid JSON returned by Gemini.");
}

exports.generateInvestmentDecision = async (data) => {

  const prompt = `
You are a Senior Equity Research Analyst.

Analyze the company using the following information.

Company Profile:
${JSON.stringify(data.companyProfile, null, 2)}

Financial Metrics:
${JSON.stringify(data.financials, null, 2)}

Recent News:
${JSON.stringify(data.news, null, 2)}

Market Sentiment:
${JSON.stringify(data.sentiment, null, 2)}

Competitors:
${JSON.stringify(data.competitors, null, 2)}

Investment Risks:
${JSON.stringify(data.risks, null, 2)}

Return ONLY valid JSON.

{
"recommendation":"INVEST",
"confidence":88,
"riskLevel":"Medium",
"investmentHorizon":"Long Term",
"reason":"Detailed explanation",
"strengths":["","",""],
"weaknesses":["","",""],
"opportunities":["","",""],
"threats":["","",""],
"pros":["","",""],
"cons":["","",""]
}
`;

  const response = await llm.invoke(prompt);

  let text = "";

  if (typeof response.content === "string") {
    text = response.content;
  } else {
    text = response.content
      .map(x => x.text || "")
      .join("");
  }

  return extractJSON(text);

};