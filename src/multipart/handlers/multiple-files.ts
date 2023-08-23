import { BadRequestException } from "@nestjs/common";
import { FastifyRequest } from "fastify";

import { UploadOptions } from "../options";
import { StorageFile } from "../../storage";
import { removeStorageFiles } from "../file";
import { getParts } from "../request";
import { filterUpload } from "../filter";
import { MultipartFile } from "@fastify/multipart";

export const handleMultipartMultipleFiles = async (
  req: FastifyRequest,
  fieldname: string,
  maxCount: number,
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
        if (part.fieldname !== fieldname) {
          throw new BadRequestException(
            `Field ${part.fieldname} doesn't accept files`,
          );
        }

        if (files.length + 1 > maxCount) {
          throw new BadRequestException(
            `Field ${part.fieldname} accepts max ${maxCount} files`,
          );
        }

        const file = await options.storage!.handleFile(
          part as MultipartFile,
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
    await removeFiles(error);
    throw error;
  }

  return { body, files, remove: () => removeFiles() };
};
