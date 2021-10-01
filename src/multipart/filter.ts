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
  cb: UploadFilterHandlerCallback,
) => void;

export type UploadFilterHandlerCallback = (
  err?: string | null,
  accept?: boolean,
) => void;

export const filterUpload = (
  uploadOptions: UploadOptions,
  req: FastifyRequest,
  file: UploadFilterFile,
) => {
  return new Promise<boolean>((resolve, reject) => {
    if (uploadOptions.filter == null) {
      return resolve(true);
    }

    const cb: UploadFilterHandlerCallback = async (err, accept) => {
      if (!accept || err != null) {
        await uploadOptions.storage!.removeFile(file, true);
      }

      if (err != null) {
        return reject(new BadRequestException(err));
      }

      resolve(accept !== false);
    };

    uploadOptions.filter(req, file, cb);
  });
};
