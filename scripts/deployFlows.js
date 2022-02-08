async function run() {
  const filePath = path.resolve(__dirname, '../flows/BGT_Flow.json');
  const flow = JSON.parse(await fs.readFile(filePath, 'utf8'));
  const friendlyName = 'BGT_Flow.json';

  try {
    await client.studio.flowValidate.update({
      definition: flow,
      friendlyName,
      status: 'published',
    });
  } catch (err) {
    console.error('Invalid Flow');
    console.dir(err.details);
    return;
  }

  const allFlows = await client.studio.flows.list();
  const existingFlow = allFlows.find(
    (flow) => flow.friendlyName === friendlyName
  );

  if (!existingFlow) {
    const newFlow = await client.studio.flows.create({
      definition: flow,
      friendlyName,
      status: 'published',
    });
    console.log('New Flow', newFlow.webhookUrl);
    return;
  }

  const { definition } = await client.studio.flows(existingFlow.sid).fetch();
  if (isEqual(definition, flow)) {
    console.log('No changes');
    return;
  }

  const updatedFlow = await client.studio.flows(existingFlow.sid).update({
    definition: flow,
    status: 'published',
    commitMessage: 'Automated deployment',
  });
  console.log('Updated flow', updatedFlow.webhookUrl);
}

run().catch(console.error);
