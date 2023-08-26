import { Controller, Post, UseInterceptors } from "@nestjs/common";
import { resolve } from "path";

import {
  AnyFilesInterceptor,
  DiskStorage,
  DiskStorageFile,
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
  MemoryStorageFile,
  UploadedFile,
  UploadedFiles,
} from "../../src";

const PATH_UPLOADS = resolve(".uploads");
const FILESIZE = 1024 * 1024 * 10;
@Controller("upload")
export class UploadController {
  @Post("single")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: FILESIZE,
      },
    }),
  )
  public async uploadSingle(@UploadedFile() file: MemoryStorageFile) {
    console.log(file);
    return file;
  }

  @Post("single-disk")
  @UseInterceptors(
    FileInterceptor("file", {
      dest: PATH_UPLOADS,
      limits: {
        fileSize: FILESIZE,
      },
    }),
  )
  public async uploadSingleToDisk(@UploadedFile() file: DiskStorageFile) {
    console.log(file);
  }

  @Post("array")
  @UseInterceptors(FilesInterceptor("files", 2, { dest: PATH_UPLOADS }))
  public async uploadArray(@UploadedFiles() files: DiskStorageFile[]) {
    files.forEach((file) => console.log(file.path));
  }

  @Post("multi")
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: "background", maxCount: 1 },
        { name: "images", maxCount: 2 },
      ],
      { dest: PATH_UPLOADS },
    ),
  )
  public async uploadMultipleFields(
    @UploadedFiles()
    files: {
      background: DiskStorageFile[];
      images: DiskStorageFile[];
    },
  ) {
    console.log(files);
    return files;
  }

  @Post("any")
  @UseInterceptors(AnyFilesInterceptor())
  public async uploadAnyFiles(
    @UploadedFiles()
    files: MemoryStorageFile[],
  ) {
    console.log(files);
    return files;
  }

  @Post("temp")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: new DiskStorage({
        dest: PATH_UPLOADS,
        removeAfter: true,
      }),
    }),
  )
  public async uploadAndRemove(@UploadedFile() file: DiskStorageFile) {
    console.log(file.size);
    return file;
  }
}
