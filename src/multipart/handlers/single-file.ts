import { BadRequestException } from "@nestjs/common";
import { FastifyRequest } from "fastify";

import { UploadOptions } from "../options";
import { StorageFile } from "../../storage";
import { getParts } from "../request";
import { filterUpload } from "../filter";
import { MultipartFile } from "@fastify/multipart";

export const handleMultipartSingleFile = async (
  req: FastifyRequest,
  fieldname: string,
  options: UploadOptions,
) => {
  const parts = getParts(req, options);
  const body: Record<string, any> = {};

  let file: StorageFile | undefined = undefined;

  const removeFiles = async (error?: boolean) => {
    if (file == null) return;
    await options.storage!.removeFile(file, error);
  };

  try {
    for await (const part of parts) {
      if (part.file) {
        if (part.fieldname !== fieldname) {
          throw new BadRequestException(
            `Field ${part.fieldname} doesn't accept file`,
          );
        } else if (file != null) {
          throw new BadRequestException(
            `Field ${fieldname} accepts only one file`,
          );
        }

        const _file = await options.storage!.handleFile(
          <MultipartFile>part,
          req,
        );

        if (await filterUpload(options, req, _file)) {
          file = _file;
        }
      } else {
        body[part.fieldname] = part.value;
      }
    }
  } catch (error) {
    await removeFiles(true);
    throw error;
  }

  return {
    body,
    file,
    remove: () => removeFiles(),
  };
};
