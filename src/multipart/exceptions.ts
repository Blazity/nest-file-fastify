import {
  BadRequestException,
  HttpException,
  PayloadTooLargeException,
} from "@nestjs/common";

export const transformException = (err: Error | undefined) => {
  if (!err || err instanceof HttpException) {
    return err;
  }

  const code: string = (err as any).code;

  switch (code) {
    case "FST_REQ_FILE_TOO_LARGE":
      return new PayloadTooLargeException();
    case "FST_PARTS_LIMIT":
    case "FST_FILES_LIMIT":
    case "FST_PROTO_VIOLATION":
    case "FST_INVALID_MULTIPART_CONTENT_TYPE":
      return new BadRequestException(err.message);
  }

  return err;
};
