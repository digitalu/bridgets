import { createBridgeApp, RoutesToSDK } from '../Lib';
import { routes } from './routes';
import express from 'express';

const app = express();
const bridgeApp = createBridgeApp(routes);

bridgeApp.handleError(({ error, req, path, mdlwData }) => {
  if (error.name === 'Internal server error') console.log(error); // Send to bug reporting
  else console.log('Other error', error, path, mdlwData);
});

app.use('', bridgeApp.connectToExpress());

app.use('', (req, res) => res.send('Root not found'));

app.listen(8077, () => {
  console.log(`Server listening on port ${8077}, project: ${'YELLA'}, mode: ${'ENV'}`);
});

export type SDKTest = RoutesToSDK<typeof routes>;

let t: SDKTest['user']['update']['return'];
