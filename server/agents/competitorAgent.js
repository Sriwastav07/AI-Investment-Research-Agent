exports.run = async (state) => {

  const industry = state.companyProfile?.industry || "";

  const competitors = {

    Technology: [
      "Microsoft",
      "Apple",
      "Google",
      "Oracle"
    ],

    Retail: [
      "Walmart",
      "Target",
      "Costco",
      "Alibaba"
    ],

    Banking: [
      "JPMorgan Chase",
      "Bank of America",
      "Citigroup"
    ],

    Automobile: [
      "Tesla",
      "Toyota",
      "Ford",
      "Hyundai"
    ],

    Healthcare: [
      "Pfizer",
      "Johnson & Johnson",
      "Merck"
    ]

  };

  return {

    competitors: competitors[industry] || []

  };

};