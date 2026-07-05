require("dotenv").config();

const finnhub = require("./utils/finnhub");

async function test() {
  try {
    const res = await finnhub.get("/stock/profile2", {
      params: {
        symbol: "AAPL",
      },
    });

    console.log(res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

test();