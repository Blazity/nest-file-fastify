import { BadRequestException } from "@nestjs/common";
import { FastifyRequest } from "fastify";

import { UploadOptions } from "../options";
import { StorageFile } from "../../storage";
import { removeFileFactory } from "../file";
import { getParts } from "../request";

export const handleMultipartSingleFile = async (
  req: FastifyRequest,
  fieldname: string,
  options: UploadOptions,
) => {
  const parts = getParts(req, options);
  const body: Record<string, any> = {};

  let file: StorageFile | undefined = undefined;

  for await (const part of parts) {
    if (part.file) {
      if (part.fieldname !== fieldname) {
        throw new BadRequestException(
          `Field ${part.fieldname} doesn't allow file`,
        );
      } else if (file != null) {
        throw new BadRequestException(
          `Field ${fieldname} requires only one file`,
        );
      }

      file = await options.storage!.handleFile(part, req);
    } else {
      body[part.fieldname] = part.value;
    }
  }

  if (file == null) {
    throw new BadRequestException(`Field ${fieldname} is required`);
  }

  return {
    body,
    file,
    remove: removeFileFactory(options.storage!, file),
  };
};
