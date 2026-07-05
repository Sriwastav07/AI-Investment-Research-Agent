const profileTool = require("../tools/profile");

exports.run = async (state) => {
  try {
    const profile = await profileTool.invoke({
      companyName: state.companyName,
    });

    console.log("\n========== PROFILE ==========");
    console.log(profile);

    return {
      companyProfile: profile,
    };
  } catch (err) {
    console.error("Profile Agent Error:", err);

    return {
      companyProfile: {},
    };
  }
};