const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const { askGemini } = require("../services/researchLLM");

module.exports = tool(

async ({ companyName, newsContext }) => {

const prompt = `
Analyze the market sentiment for ${companyName}.

News:

${newsContext}

Return ONLY JSON.

{
"sentiment":"Positive",
"score":87,
"reason":"..."
}
`;

return await askGemini(prompt);

},

{

name:"sentiment_tool",

description:"Analyzes sentiment.",

schema:z.object({

companyName:z.string(),

newsContext:z.string()

})

}

);