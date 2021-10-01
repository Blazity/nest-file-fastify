import { FastifyRequest } from "fastify";

import { UploadOptions } from "../options";
import { StorageFile } from "../../storage";
import { getParts } from "../request";
import { removeStorageFiles } from "../file";

export const handleMultipartAnyFiles = async (
  req: FastifyRequest,
  options: UploadOptions,
) => {
  const parts = getParts(req, options);
  const body: Record<string, any> = {};

  const files: StorageFile[] = [];

  const removeFiles = async (error?: boolean) => {
    return await removeStorageFiles(options.storage!, files, error);
  };

  try {
    for await (const part of parts) {
      if (part.file) {
        files.push(await options.storage!.handleFile(part, req));
      } else {
        body[part.fieldname] = part.value;
      }
    }
  } catch (error) {
    await removeFiles(true);
    throw error;
  }

  return { body, files, remove: removeFiles };
};
