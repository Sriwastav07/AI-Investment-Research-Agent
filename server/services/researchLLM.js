const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.2,
});

function extractJSON(text) {

  text = text.replace(/```json/g, "");
  text = text.replace(/```/g, "");
  text = text.trim();

  try {
    return JSON.parse(text);
  } catch (e) {}

  const objStart = text.indexOf("{");
  const objEnd = text.lastIndexOf("}");

  if (objStart !== -1 && objEnd !== -1) {
    return JSON.parse(text.substring(objStart, objEnd + 1));
  }

  const arrStart = text.indexOf("[");
  const arrEnd = text.lastIndexOf("]");

  if (arrStart !== -1 && arrEnd !== -1) {
    return JSON.parse(text.substring(arrStart, arrEnd + 1));
  }

  throw new Error("Gemini did not return valid JSON.");
}

exports.askGemini = async (prompt) => {

  const response = await llm.invoke(prompt);

  let text = "";

  if (typeof response.content === "string")
    text = response.content;
  else
    text = response.content.map(c => c.text || "").join("");

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return extractJSON(text);
};