const axios = require("axios");

const gnews = axios.create({
  baseURL: "https://gnews.io/api/v4",
  timeout: 10000,
});

module.exports = gnews;