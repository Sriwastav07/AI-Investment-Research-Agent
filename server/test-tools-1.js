const profileTool = require('./tools/profile');
const financialsTool = require('./tools/financials');
const competitorsTool = require('./tools/competitors');

async function test() {
  console.log('Testing Profile Tool...');
  const profile = await profileTool.invoke({ companyName: 'Tesla' });
  console.log('Profile:', JSON.stringify(profile, null, 2));

  console.log('\nTesting Financials Tool...');
  const financials = await financialsTool.invoke({ companyName: 'Tesla' });
  console.log('Financials:', JSON.stringify(financials, null, 2));

  console.log('\nTesting Competitors Tool...');
  const competitors = await competitorsTool.invoke({ companyName: 'Tesla', industry: 'Auto' });
  console.log('Competitors:', JSON.stringify(competitors, null, 2));
}

test().catch(console.error);
