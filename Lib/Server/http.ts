// import { createServer, IncomingMessage, ServerResponse, Server } from 'http';
// import { Routes, Request, Response, NReturn } from '../Interfaces';
// import { createRoutes } from '../Routes';

// const getJSONDataFromRequestStream = <T>(request: IncomingMessage): Promise<T> =>
//   new Promise((resolve) => {
//     const chunks: any[] = [];
//     request.on('data', (chunk) => {
//       chunks.push(chunk);
//     });
//     request.on('end', () => {
//       try {
//         resolve(JSON.parse(Buffer.concat(chunks).toString()));
//       } catch (err) {
//         resolve(JSON.parse('{}'));
//       }
//     });
//   });

// const getJSONQueryFromURL = (queryUrl: string): Record<string, string> => {
//   const queryJSON: Record<string, string> = {};
//   try {
//     if (!queryUrl) return queryJSON;

//     const queries = queryUrl.split('?');

//     queries.forEach((query: string) => {
//       const [key, value] = query.split('=');
//       queryJSON[key] = value;
//     });

//     return queryJSON;
//   } catch (err) {
//     console.error(err);
//     return queryJSON;
//   }
// };

// export const createNeoServer = (routes: Routes): Server => {
//   const serverRoutes = createRoutes(routes);

//   console.log(serverRoutes);
//   return createServer(async (request: IncomingMessage, response: ServerResponse) => {
//     const req: Request = request;
//     const res: Response = response;

//     console.log('\x1b[32m', `-> ${new Date().toLocaleString()}: ${req.url}`, '\x1b[0m');

//     const [url, queryString] = req.url?.split('?') || ['/not-found'];
//     req.query = getJSONQueryFromURL(queryString);

//     const route = serverRoutes[url] || serverRoutes['/not-found'];

//     if (req.method !== 'GET') req.body = await getJSONDataFromRequestStream(request);

//     res.setHeader('Content-Type', 'application/json');

//     let validation: NReturn<any, any> = {};
//     if (route.validator) validation = await route.validator.handle(req as any, {});

//     if (validation.error) {
//       res.statusCode = validation.error.status || 500;
//       return res.end(JSON.stringify({ error: validation.error }));
//     }

//     console.log(validation);

//     const result = await route.handler({ req, body: req.body, query: req.query, ...validation });

//     if (result.error) {
//       res.statusCode = result.error.status || 500;
//       return res.end(JSON.stringify({ error: result.error }));
//     }

//     res.statusCode = 200;

//     res.end(JSON.stringify(result));
//   });
// };
