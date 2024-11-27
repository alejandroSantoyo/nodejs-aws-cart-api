// import { NestFactory } from '@nestjs/core';

// import helmet from 'helmet';

// import { AppModule } from './app.module';

// const port = process.env.PORT || 4000;

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: (req, callback) => callback(null, true),
//   });
//   app.use(helmet());

//   await app.listen(port);
// }
// bootstrap().then(() => {
//   console.log('App is running on %s port', port);
// });

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import { Handler } from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';

let cachedServer: any;

async function bootstrapServer(): Promise<any> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    await nestApp.init();
    cachedServer = createServer(expressApp);
  }
  return cachedServer;
}

export const handler: Handler = async (event, context) => {
  const server = await bootstrapServer();
  return proxy(server, event, context, 'PROMISE').promise;
};