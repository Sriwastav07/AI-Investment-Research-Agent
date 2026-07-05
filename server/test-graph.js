const graph = require('./graph/investGraph');

async function test() {
  console.log('Testing LangGraph Workflow...');
  const initialState = {
    companyName: 'Tesla',
    status: 'Starting...'
  };

  const stream = await graph.stream(initialState);
  
  for await (const update of stream) {
    const nodeName = Object.keys(update)[0];
    const nodeData = update[nodeName];
    console.log(`[Node: ${nodeName}] Status: ${nodeData.status}`);
    if (nodeName === 'node_decision') {
      console.log('Final Decision:', nodeData.recommendation);
      console.log('Reasoning:', nodeData.reasoning);
    }
  }
}

test().catch(console.error);
