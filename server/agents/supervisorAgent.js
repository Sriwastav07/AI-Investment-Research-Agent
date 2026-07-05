const profileAgent = require("./profileAgent");
const financeAgent = require("./financeAgent");
const newsAgent = require("./newsAgent");
const sentimentAgent = require("./sentimentAgent");
const competitorAgent = require("./competitorAgent");
const riskAgent = require("./riskAgent");
const investmentAgent = require("./investmentAgent");

exports.run = async (companyName, onUpdate) => {

  let state = {
    companyName,
  };

  console.log("START");

  onUpdate({ status: "🔍 Research started..." });

  console.log("Profile...");
  Object.assign(state, await profileAgent.run(state));
  console.log("✔ Profile Done");

  onUpdate({ status: "📊 Collecting financial data..." });

  console.log("Finance...");
  Object.assign(state, await financeAgent.run(state));
  console.log("✔ Finance Done");

  onUpdate({ status: "📰 Reading latest news..." });

  console.log("News...");
  Object.assign(state, await newsAgent.run(state));
  console.log("✔ News Done");

  onUpdate({ status: "😊 Analyzing market sentiment..." });

  console.log("Sentiment...");
  Object.assign(state, await sentimentAgent.run(state));
  console.log("✔ Sentiment Done");

  onUpdate({ status: "⚔ Comparing competitors..." });

  console.log("Competitors...");
  Object.assign(state, await competitorAgent.run(state));
  console.log("✔ Competitors Done");

  onUpdate({ status: "⚠ Evaluating risks..." });

  console.log("Risks...");
  Object.assign(state, await riskAgent.run(state));
  console.log("✔ Risks Done");

  onUpdate({
    status: "🤖 Gemini is making the investment decision..."
  });

  console.log("Investment...");
  Object.assign(state, await investmentAgent.run(state));
  console.log("✔ Investment Done");

  onUpdate({
    status: "✅ Research Completed"
  });

  console.log("END");

  return state;
};