import { BadRequestException } from "@nestjs/common";
import { FastifyRequest } from "fastify";

import { UploadOptions } from "../options";
import { StorageFile } from "../../storage/storage";
import { getParts } from "../request";
import { removeStorageFiles } from "../file";
import { filterUpload } from "../filter";
import { MultipartFile } from "@fastify/multipart";

export interface UploadField {
  /**
   * Field name
   */
  name: string;
  /**
   * Max number of files in this field
   */
  maxCount?: number;
}

export type UploadFieldMapEntry = Required<Pick<UploadField, "maxCount">>;

export const uploadFieldsToMap = (uploadFields: UploadField[]) => {
  const map = new Map<string, UploadFieldMapEntry>();

  uploadFields.forEach(({ name, ...opts }) => {
    map.set(name, { maxCount: 1, ...opts });
  });

  return map;
};

export const handleMultipartFileFields = async (
  req: FastifyRequest,
  fieldsMap: Map<string, UploadFieldMapEntry>,
  options: UploadOptions,
) => {
  const parts = getParts(req, options);
  const body: Record<string, any> = {};

  const files: Record<string, StorageFile[]> = {};

  const removeFiles = async (error?: boolean) => {
    const allFiles = ([] as StorageFile[]).concat(...Object.values(files));
    return await removeStorageFiles(options.storage!, allFiles, error);
  };

  try {
    for await (const part of parts) {
      if (part.file) {
        const fieldOptions = fieldsMap.get(part.fieldname);

        if (fieldOptions == null) {
          throw new BadRequestException(
            `Field ${part.fieldname} doesn't accept files`,
          );
        }

        if (files[part.fieldname] == null) {
          files[part.fieldname] = [];
        }

        if (files[part.fieldname].length + 1 > fieldOptions.maxCount) {
          throw new BadRequestException(
            `Field ${part.fieldname} accepts max ${fieldOptions.maxCount} files`,
          );
        }

        const file = await options.storage!.handleFile(
          part as MultipartFile,
          req,
        );

        if (await filterUpload(options, req, file)) {
          files[part.fieldname].push(file);
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
    files,
    remove: () => removeFiles(),
  };
};
