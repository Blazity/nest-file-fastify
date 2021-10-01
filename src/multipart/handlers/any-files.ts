import { FastifyRequest } from "fastify";

import { UploadOptions } from "../../options";
import { StorageFile } from "../../storage";
import { getParts } from "../request";

export const handleMultipartAnyFiles = async (
  req: FastifyRequest,
  options: UploadOptions,
) => {
  const parts = getParts(req, options);
  const body: Record<string, any> = {};

  const files: StorageFile[] = [];

  for await (const part of parts) {
    if (part.file) {
      files.push(await options.storage!.handleFile(part, req));
    } else {
      body[part.fieldname] = part.value;
    }
  }

  return { body, files };
};
