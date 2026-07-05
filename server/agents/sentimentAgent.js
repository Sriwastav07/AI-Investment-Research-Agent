const Sentiment = require("sentiment");

const sentiment = new Sentiment();

exports.run = async (state) => {
  try {
    const news = state.news || [];

    if (news.length === 0) {
      return {
        sentiment: {
          summary: "Neutral",
          score: 50,
        },
      };
    }

    let totalScore = 0;

    for (const article of news) {
      const text = `${article.title || ""} ${article.description || ""}`;
      totalScore += sentiment.analyze(text).score;
    }

    const avg = totalScore / news.length;

    let summary = "Neutral";
    let score = 50;

    if (avg > 2) {
      summary = "Positive";
      score = 80;
    } else if (avg < -2) {
      summary = "Negative";
      score = 20;
    }

    return {
      sentiment: {
        summary,
        score,
      },
    };
  } catch (err) {
    console.log("Sentiment Agent:", err.message);

    return {
      sentiment: {
        summary: "Neutral",
        score: 50,
      },
    };
  }
};