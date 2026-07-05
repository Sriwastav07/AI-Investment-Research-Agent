require("dotenv").config();

const profileTool = require("./tools/profile");

(async () => {
  const data = await profileTool.invoke({
    companyName: "Amazon",
  });

  console.log(data);
})();