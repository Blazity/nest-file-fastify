import { MultipartFile as _MultipartFile } from "fastify-multipart";
import { Readable } from "stream";

import { Storage, StorageFile } from "../storage";

export type MultipartFile = Omit<_MultipartFile, "file"> & {
  value?: any;
  file: Readable & { truncated?: boolean };
};

export const removeFileFactory =
  (storage: Storage, file?: StorageFile) => async () => {
    if (!file) return;
    await storage.removeFile(file);
  };

export const removeFilesFactory =
  (storage: Storage, files?: (StorageFile | undefined)[]) => async () => {
    if (files == null) return;
    await Promise.all(files.map((file) => file && storage.removeFile(file)));
  };
