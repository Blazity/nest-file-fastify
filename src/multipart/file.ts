import { MultipartFile as _MultipartFile } from "fastify-multipart";
import { Readable } from "stream";

export type MultipartFile = Omit<_MultipartFile, "file"> & {
  value?: any;
  file: Readable & { truncated?: boolean };
};
