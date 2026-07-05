const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const gnews = require("../utils/gnews");

module.exports = tool(
  async ({ companyName }) => {

    const response = await gnews.get("/search", {
      params: {
        q: companyName,
        lang: "en",
        max: 10,
        token: process.env.GNEWS_API_KEY,
      },
    });

    return response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
    }));
  },

  {
    name: "news_tool",

    description: "Latest company news.",

    schema: z.object({
      companyName: z.string(),
    }),
  }
);