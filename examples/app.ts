import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import multipart from "@fastify/multipart";

import { AppModule } from "./app-module";

export const runApp = async () => {
  const adapter = new FastifyAdapter();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );

  app.register(multipart as any);

  await app.listen(3000, (err, address) => {
    if (err) return console.error(err);
    console.log(`Listening on ${address}!`);
  });

  return app;
};
