import { Observable, tap } from "rxjs";
import {
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Type,
} from "@nestjs/common";

import { MultipartFile, getMultipartRequest } from "../fastify";
import { transformUploadOptions, UploadOptions } from "../options";
import { StorageFile } from "../storage";

export function AnyFilesInterceptor(
  options?: UploadOptions,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    private readonly options: UploadOptions;

    constructor() {
      this.options = transformUploadOptions(options);
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();
      const req = getMultipartRequest(ctx);

      const body: Record<string, any> = {};

      const parts = req.parts(
        this.options,
      ) as AsyncIterableIterator<MultipartFile>;

      const files: StorageFile[] = [];

      for await (const part of parts) {
        if (part.file) {
          files.push(await this.options.storage!.handleFile(part, req));
        } else {
          body[part.fieldname] = part.value;
        }
      }

      req.body = body;
      req.storageFiles = files;

      return next.handle().pipe(
        tap(async () => {
          return await Promise.all(
            files.map((file) => this.options.storage!.removeFile(file)),
          );
        }),
      );
    }
  }

  const Interceptor = mixin(MixinInterceptor);

  return Interceptor;
}
