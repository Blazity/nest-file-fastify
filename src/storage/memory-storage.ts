import { FastifyRequest } from "fastify";
import { MultipartFile } from "fastify-multipart";
import { RouteGenericInterface } from "fastify/types/route";
import { Server, IncomingMessage } from "http";

import { StorageFile, Storage } from "./storage";

export interface MemoryStorageFile extends StorageFile {
  buffer: Buffer;
}

export class MemoryStorage implements Storage<MemoryStorageFile> {
  public async handleFile(
    file: MultipartFile,
    req: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>,
  ) {
    const buffer = await file.toBuffer();

    const { encoding, mimetype, fieldname } = file;

    return {
      buffer,
      size: buffer.length,
      encoding,
      mimetype,
      fieldname,
    };
  }

  public async removeFile(file: MemoryStorageFile) {
    delete (file as any).buffer;
  }
}
