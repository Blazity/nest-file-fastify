import { Observable, tap } from "rxjs";
import {
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
  Type,
  BadRequestException,
} from "@nestjs/common";

import { MultipartFile } from "../fastify";
import { transformUploadOptions, UploadOptions } from "../options";
import { getMultipartRequest } from "../request";
import { StorageFile } from "../storage";

export function FileInterceptor(
  fieldname: string,
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

      let file: StorageFile | undefined = undefined;

      for await (const part of parts) {
        if (part.file) {
          if (part.fieldname !== fieldname) {
            throw new BadRequestException(
              `Field ${part.fieldname} doesn't allow file`,
            );
          } else if (file != null) {
            throw new BadRequestException(
              `Field ${fieldname} requires only one file`,
            );
          }

          file = await this.options.storage!.handleFile(part, req);
        } else {
          body[part.fieldname] = part.value;
        }
      }

      if (file == null) {
        throw new BadRequestException(`Field ${fieldname} is required`);
      }

      req.body = body;
      req.storageFile = file;

      return next.handle().pipe(
        tap(async () => {
          return await this.options.storage!.removeFile(file);
        }),
      );
    }
  }

  const Interceptor = mixin(MixinInterceptor);

  return Interceptor;
}
