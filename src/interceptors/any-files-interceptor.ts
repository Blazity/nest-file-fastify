import { Observable, tap } from "rxjs";
import {
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Type,
} from "@nestjs/common";

import { getMultipartRequest } from "../multipart";
import { transformUploadOptions, UploadOptions } from "../options";
import { handleMultipartAnyFiles } from "../multipart/handlers/any-files";

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

      const { body, files } = await handleMultipartAnyFiles(req, this.options);

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
