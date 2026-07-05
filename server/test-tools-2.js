const newsTool = require('./tools/news');
const sentimentTool = require('./tools/sentiment');
const risksTool = require('./tools/risks');

async function test() {
  console.log('Testing News Tool...');
  const news = await newsTool.invoke({ companyName: 'Tesla' });
  console.log('News:', JSON.stringify(news, null, 2));

  console.log('\nTesting Sentiment Tool...');
  const sentiment = await sentimentTool.invoke({ companyName: 'Tesla', newsContext: 'Record earnings' });
  console.log('Sentiment:', JSON.stringify(sentiment, null, 2));

  console.log('\nTesting Risks Tool...');
  const risks = await risksTool.invoke({ companyName: 'Tesla', financials: 'Revenue $96B', industry: 'Auto' });
  console.log('Risks:', JSON.stringify(risks, null, 2));
}

test().catch(console.error);
