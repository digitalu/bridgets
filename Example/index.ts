import { createExpressMiddleware, RoutesToSDK, onError } from '../Lib';
import { routes } from './routes';
import express from 'express';

const app = express();

const errorHandler = onError(({ error, req, path, mdlwData }) => {
  if (error.name === 'Internal server error') console.log(error); // Send to bug reporting
  else console.log('Other error', error, path, mdlwData);
});

app.use('', createExpressMiddleware(routes, errorHandler));

app.use('', (req, res) => res.send('Root not found'));

app.listen(8077, () => {
  console.log(`Server listening on port ${8077}, project: ${'YELLA'}, mode: ${'ENV'}`);
});

export type SDKType = RoutesToSDK<typeof routes>;

let t: SDKType['user']['update']['return'];
