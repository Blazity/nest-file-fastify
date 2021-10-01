import { BadRequestException } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { FastifyRequest } from "fastify";
import { RouteGenericInterface } from "fastify/types/route";
import { IncomingMessage, Server } from "http";

import { StorageFile } from "../storage";

export type FastifyMultipartRequest = FastifyRequest<
  RouteGenericInterface,
  Server,
  IncomingMessage
> & {
  storageFile?: StorageFile;
  storageFiles?: StorageFile[] | Record<string, StorageFile[]>;
};

export const getMultipartRequest = (ctx: HttpArgumentsHost) => {
  const req = ctx.getRequest<FastifyMultipartRequest>();

  if (!req.isMultipart()) {
    throw new BadRequestException();
  }

  return req;
};
