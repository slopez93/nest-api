import { APIGatewayProxyHandler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import awsServerlessExpress from 'aws-serverless-express';
import express from 'express';
import { AppModule } from 'src/shared/infrastructure/nest/app.module';


let cachedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express();
  const adapter = new ExpressAdapter(expressApp);
  const app = await NestFactory.create(AppModule, adapter);
  app.enableCors();
  await app.init();
  return awsServerlessExpress.createServer(expressApp);
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer()
  }
  return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE')
      .promise;
};