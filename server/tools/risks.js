const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const { askGemini } = require("../services/researchLLM");

module.exports = tool(

async ({ companyName }) => {

const prompt = `
List the biggest investment risks of ${companyName}.

Return ONLY JSON.

[
{
"risk":"",
"severity":"High",
"description":""
}
]
`;

return await askGemini(prompt);

},

{

name:"risk_tool",

description:"Investment risk analysis.",

schema:z.object({

companyName:z.string()

})

}

);