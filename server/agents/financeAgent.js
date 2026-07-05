const financialTool = require("../tools/financials");

exports.run = async (state) => {
  try {
    const financials = await financialTool.invoke({
      companyName: state.companyName,
    });

    console.log("\n========== FINANCIALS ==========");
    console.log(financials);

    return {
      financials,
    };
  } catch (err) {
    console.error("Finance Agent Error:", err);

    return {
      financials: {},
    };
  }
};