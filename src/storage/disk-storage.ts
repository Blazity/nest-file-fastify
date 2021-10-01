import { MultipartFile } from "fastify-multipart";
import { FastifyRequest } from "fastify";
import { tmpdir } from "os";
import { createWriteStream } from "fs";
import { mkdir, unlink } from "fs/promises";
import { Server, IncomingMessage } from "http";
import { join } from "path";
import { RouteGenericInterface } from "fastify/types/route";

import { StorageFile, Storage } from "./storage";
import { getUniqueFilename, pathExists } from "../fs";
import { pump } from "../stream";

export interface DiskStorageFile extends StorageFile {
  dest: string;
  filename: string;
  originalFilename: string;
  path: string;
}

type DiskStorageOptionHandler =
  | ((file: MultipartFile, req: FastifyRequest) => Promise<string> | string)
  | string;

export interface DiskStorageOptions {
  dest?: DiskStorageOptionHandler;
  filename?: DiskStorageOptionHandler;
  removeAfter?: boolean;
}

const excecuteStorageHandler = (
  file: MultipartFile,
  req: FastifyRequest,
  obj?: DiskStorageOptionHandler,
) => {
  if (typeof obj === "function") {
    return obj(file, req);
  }

  if (obj != null) return obj;

  return null;
};

export class DiskStorage
  implements Storage<DiskStorageFile, DiskStorageOptions>
{
  constructor(public readonly options?: DiskStorageOptions) {}

  public async handleFile(
    file: MultipartFile,
    req: FastifyRequest<RouteGenericInterface, Server, IncomingMessage>,
  ) {
    const filename = await this.getFilename(file, req, this.options?.filename);
    const dest = await this.getFileDestination(file, req, this.options?.dest);

    if (!(await pathExists(dest))) {
      await mkdir(dest, { recursive: true });
    }

    const path = join(dest, filename);
    const stream = createWriteStream(path);

    await pump(file.file, stream);

    const { encoding, fieldname, mimetype } = file;

    return {
      size: stream.bytesWritten,
      dest,
      filename,
      originalFilename: file.filename,
      path,
      mimetype,
      encoding,
      fieldname,
    };
  }

  public async removeFile(file: DiskStorageFile, force?: boolean) {
    if (!this.options?.removeAfter && !force) return;

    await unlink(file.path);
  }

  protected async getFilename(
    file: MultipartFile,
    req: FastifyRequest,
    obj?: DiskStorageOptionHandler,
  ): Promise<string> {
    return (
      excecuteStorageHandler(file, req, obj) ?? getUniqueFilename(file.filename)
    );
  }

  protected async getFileDestination(
    file: MultipartFile,
    req: FastifyRequest,
    obj?: DiskStorageOptionHandler,
  ): Promise<string> {
    return excecuteStorageHandler(file, req, obj) ?? tmpdir();
  }
}
