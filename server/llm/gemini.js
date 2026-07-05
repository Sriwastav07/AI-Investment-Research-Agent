const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const llm = new ChatGoogleGenerativeAI({

    model: "gemini-2.5-flash",

    apiKey: process.env.GOOGLE_API_KEY,

    temperature:0.2

});

module.exports=llm;