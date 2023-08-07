import { FastifyRequest } from "fastify";

import { UploadOptions } from "../options";
import { StorageFile } from "../../storage";
import { getParts } from "../request";
import { removeStorageFiles } from "../file";
import { filterUpload } from "../filter";
import { MultipartFile } from "@fastify/multipart";

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
        const file = await options.storage!.handleFile(
          <MultipartFile>part,
          req,
        );

        if (await filterUpload(options, req, file)) {
          files.push(file);
        }
      } else {
        body[part.fieldname] = part.value;
      }
    }
  } catch (error) {
    await removeFiles(true);
    throw error;
  }

  return { body, files, remove: () => removeFiles() };
};
