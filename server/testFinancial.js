require("dotenv").config();

const financialTool = require("./tools/financials");

(async () => {
  const data = await financialTool.invoke({
    companyName: "Amazon",
  });

  console.log(data.revenue);
  console.log(data.netIncome);
  console.log(data.cashFlow);
})();