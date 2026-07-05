const newsTool = require("../tools/news");

exports.run = async (state) => {
  try {
    const news = await newsTool.invoke({
      companyName: state.companyName,
    });

    return {
      news,
    };
  } catch (err) {
    console.error("News Agent:", err.message);

    return {
      news: [],
    };
  }
};