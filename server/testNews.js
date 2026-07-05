require("dotenv").config();

const newsTool = require("./tools/news");

(async () => {

    const news = await newsTool.invoke({
        companyName: "Amazon"
    });

    console.log(news);

})();