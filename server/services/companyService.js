const axios = require("axios");

exports.getCompanyProfile = async (companyName) => {
  try {
    const wiki = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(companyName)}`
    );

    return {
      name: wiki.data.title,
      description: wiki.data.extract,
      image: wiki.data.thumbnail?.source || "",
      wikipedia: wiki.data.content_urls?.desktop?.page || ""
    };
  } catch {
    return {
      name: companyName,
      description: "Company information unavailable.",
      image: "",
      wikipedia: ""
    };
  }
};

exports.getStockPrice = async (symbol) => {
  try {
    const res = await axios.get("https://api.twelvedata.com/price", {
      params: {
        symbol,
        apikey: process.env.TWELVE_DATA_API_KEY
      }
    });

    return res.data.price;
  } catch {
    return null;
  }
};