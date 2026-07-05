const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const { askGemini } = require("../services/researchLLM");

module.exports = tool(

async ({ companyName }) => {

const prompt = `
Who are the biggest competitors of ${companyName}?

Return ONLY JSON.

[
{
"name":"",
"reason":""
}
]
`;

return await askGemini(prompt);

},

{

name:"competitor_tool",

description:"Find competitors.",

schema:z.object({

companyName:z.string()

})

}

);