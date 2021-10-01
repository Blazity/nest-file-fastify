<div align="left">
  <h1> Nest.js file decorators for fastify</h1>

[![Github Actions](https://img.shields.io/github/workflow/status/blazity/nest-file-fastify/Build?style=flat-square)](https://github.com/Blazity/nest-file-fastify)
[![NPM](https://img.shields.io/npm/v/@blazity/nest-file-fastify.svg?style=flat-square)](https://www.npmjs.com/package/@blazity/nest-file-fastify)
[![NPM](https://img.shields.io/npm/dm/@blazity/nest-file-fastify?style=flat-square)](https://www.npmjs.com/package/@blazity/nest-file-fastify)

</div>

This library adds decorators for [Nest.js](https://github.com/nestjs/nest) to support [fastify-multipart](https://github.com/fastify/fastify-multipart). The API is very similar to the official Nest.js Express file decorators.

## Installation

NPM

```bash
$ npm install @blazity/nest-file-fastify fastify-multipart
```

Yarn

```bash
$ yarn add @blazity/nest-file-fastify fastify-multipart
```

## Docs

### Single file

```ts
import { FileInterceptor, UploadedFile, StorageFile } from '@blazity/nest-file-fastify';

@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: StorageFile) {
  console.log(file);
}
```

`FileInterceptor` arguments:

- `fieldname`: string - name of the field that holds a file

- `options`: optional object of type [`UploadOptions`](https://github.com/Blazity/nest-file-fastify/blob/master/src/options.ts#L3)

### Array of files

```ts
import { FilesInterceptor, UploadedFiles, StorageFile } from '@blazity/nest-file-fastify';

@Post('upload')
@UseInterceptors(FilesInterceptor('files'))
uploadFile(@UploadedFiles() files: StorageFile[]) {
  console.log(files);
}
```

`FilesInterceptor` arguments:

- `fieldname`: string - name of the field that holds files

- `maxCount`: optional number - maximum number of files to accept

- `options`: optional object of type [`UploadOptions`](https://github.com/Blazity/nest-file-fastify/blob/master/src/options.ts#L3)

### Multiple files

```ts
import { FileFieldsInterceptor, UploadedFiles, StorageFile } from '@blazity/nest-file-fastify';

@Post('upload')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'avatar', maxCount: 1 },
  { name: 'background', maxCount: 1 },
]))
uploadFile(@UploadedFiles() files: { avatar?: StorageFile[], background?: StorageFile[] }) {
  console.log(files);
}
```

`FileFieldsInterceptor` arguments:

- `uploadFields`: object of type [`UploadField`](https://github.com/Blazity/nest-file-fastify/blob/master/src/interceptors/file-fields-interceptor.ts#L15)

- `options`: optional object of type [`UploadOptions`](https://github.com/Blazity/nest-file-fastify/blob/master/src/options.ts#L3)

### Any files

```ts
import { AnyFilesInterceptor, UploadedFiles, StorageFile } from '@blazity/nest-file-fastify';

@Post('upload')
@UseInterceptors(AnyFilesInterceptor()
uploadFile(@UploadedFiles() files: StorageFile[]) {
  console.log(files);
}
```

`AnyFilesInterceptor` arguments:

- `options`: optional object of type [`UploadOptions`](https://github.com/Blazity/nest-file-fastify/blob/master/src/options.ts#L3)
