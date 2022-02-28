const path = require('path');
const { isEqual } = require('lodash');
const fs = require('fs').promises;
require('dotenv').config()
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function run() {
  const folderPath = path.resolve(__dirname, '../flows/');
  let files = await fs.readdir(folderPath, 'utf8')
  files = files.filter ( file => {
    return path.extname(file) === ".json"
  })

  files.map( async (file) => {
    const filePath = `${folderPath}/${file}`
    const flow = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const friendlyName = file.split('.')[0];

    const date = new Date().toLocaleString('es-CO')
    const commitMessage = `Changes: ${date}`

    try {
      await client.studio.flowValidate.update({
        definition: flow,
        friendlyName,
        status: 'published',
      });
    } catch (err) {
      console.error('Invalid Flow: ', friendlyName);
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
        commitMessage,
        status: 'published',
      });
      console.log('New Flow: ', newFlow.friendlyName);
      return;
    }

    const { definition } = await client.studio.flows(existingFlow.sid).fetch();
    if (isEqual(definition, flow)) {
      console.log('No changes: ', existingFlow.friendlyName );
      return;
    }

    const updatedFlow = await client.studio.flows(existingFlow.sid).update({
      definition: flow,
      status: 'published',
      commitMessage,
    });
    console.log('Updated flow: ', updatedFlow.friendlyName);

  })
}

run().catch(console.error);

