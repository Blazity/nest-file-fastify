import { BadRequestException } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { UploadOptions } from ".";

import { DiskStorageFile, MemoryStorageFile, StorageFile } from "../storage";

export type UploadFilterFile =
  | DiskStorageFile
  | MemoryStorageFile
  | StorageFile;

export type UploadFilterHandler = (
  req: FastifyRequest,
  file: UploadFilterFile,
) => Promise<boolean | string> | boolean | string;

export const filterUpload = async (
  uploadOptions: UploadOptions,
  req: FastifyRequest,
  file: UploadFilterFile,
): Promise<boolean> => {
  if (uploadOptions.filter == null) {
    return true;
  }

  try {
    const res = await uploadOptions.filter(req, file);

    if (typeof res === "string") {
      throw new BadRequestException(res);
    }

    return res;
  } catch (error) {
    await uploadOptions.storage!.removeFile(file, true);
    throw error;
  }
};
