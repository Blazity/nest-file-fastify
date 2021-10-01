import { BadRequestException } from "@nestjs/common";
import { FastifyRequest } from "fastify";

import { UploadOptions } from "../../options";
import { StorageFile } from "../../storage/storage";
import { getParts } from "../request";

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

  for await (const part of parts) {
    if (part.file) {
      const fieldOptions = fieldsMap.get(part.fieldname);

      if (fieldOptions == null) {
        throw new BadRequestException(
          `Field ${part.fieldname} doesn't allow files`,
        );
      }

      if (files[part.fieldname] == null) {
        files[part.fieldname] = [];
      }

      if (files[part.fieldname].length + 1 > fieldOptions.maxCount) {
        throw new BadRequestException(
          `Field ${part.fieldname} allows only ${fieldOptions.maxCount} files`,
        );
      }

      files[part.fieldname].push(await options.storage!.handleFile(part, req));
    } else {
      body[part.fieldname] = part.value;
    }
  }

  const fields = Array.from(fieldsMap.keys());
  const providedFields = Object.keys(files);

  for (const field of fields) {
    if (!providedFields.includes(field)) {
      throw new BadRequestException(`Field ${field} is required`);
    }
  }

  return { body, files };
};
