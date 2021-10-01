import { FastifyRequest } from "fastify";
import { MultipartFile } from "fastify-multipart";

export interface StorageFile {
  size: number;
  file: MultipartFile;
}

export interface Storage<T extends StorageFile = StorageFile, K = any> {
  handleFile: (file: MultipartFile, req: FastifyRequest) => Promise<T>;
  removeFile: (file: T) => Promise<void> | void;
  options?: K;
}
