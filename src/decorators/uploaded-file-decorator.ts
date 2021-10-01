import { createParamDecorator, ExecutionContext } from "@nestjs/common";

import { getMultipartRequest } from "../request";
import { StorageFile } from "../storage/storage";

export const UploadedFile = createParamDecorator(
  async (
    data: any,
    ctx: ExecutionContext,
  ): Promise<StorageFile | undefined> => {
    const req = getMultipartRequest(ctx.switchToHttp());

    return req?.storageFile;
  },
);
