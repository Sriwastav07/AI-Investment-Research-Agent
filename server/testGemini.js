require("dotenv").config();

const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

(async () => {

    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: process.env.GOOGLE_API_KEY
    });

    const response = await llm.invoke("Say hello");

    console.log(response.content);

})();