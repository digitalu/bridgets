import { createExpressMiddleware, RoutesToSDK } from '../Lib';
import { routes } from './routes';
import express from 'express';

const app = express();

app.use('', createExpressMiddleware(routes));

app.use('', (req, res) => res.send('Root not found'));

app.listen(8077, () => {
  console.log(`Server listening on port ${8077}, project: ${'YELLA'}, mode: ${'ENV'}`);
});

export type SDKRoutes = RoutesToSDK<typeof routes>;
