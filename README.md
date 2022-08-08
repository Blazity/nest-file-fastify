<div align="left">
  <h1> fastify-multipart for Nest.js</h1>

[![Github Actions](https://img.shields.io/github/workflow/status/blazity/nest-file-fastify/Build?style=flat-square)](https://github.com/Blazity/nest-file-fastify)
[![NPM](https://img.shields.io/npm/v/@blazity/nest-file-fastify.svg?style=flat-square)](https://www.npmjs.com/package/@blazity/nest-file-fastify)
[![NPM](https://img.shields.io/npm/dm/@blazity/nest-file-fastify?style=flat-square)](https://www.npmjs.com/package/@blazity/nest-file-fastify)

</div>

This library adds decorators for [Nest.js](https://github.com/nestjs/nest) to support [@fastify/multipart](https://github.com/fastify/fastify-multipart). The API is very similar to the official Nest.js Express file decorators.

## Installation

NPM

```bash
$ npm install @blazity/nest-file-fastify @fastify/multipart
```

Yarn

```bash
$ yarn add @blazity/nest-file-fastify @fastify/multipart
```

and register multpart plugin in your Nest.js application

```typescript
import fastyfyMultipart from '@fastify/multipart';

...

app.register(fastyfyMultipart);
```

## Docs

### Single file

```ts
import { FileInterceptor, UploadedFile, MemoryStorageFile } from '@blazity/nest-file-fastify';

@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: MemoryStorageFile) {
  console.log(file);
}
```

`FileInterceptor` arguments:

- `fieldname`: string - name of the field that holds a file

- `options`: optional object of type [`UploadOptions`](src/multipart/options.ts#L4)

### Array of files

```ts
import { FilesInterceptor, UploadedFiles, MemoryStorageFile } from '@blazity/nest-file-fastify';

@Post('upload')
@UseInterceptors(FilesInterceptor('files'))
uploadFile(@UploadedFiles() files: MemoryStorageFile[]) {
  console.log(files);
}
```

`FilesInterceptor` arguments:

- `fieldname`: string - name of the field that holds files

- `maxCount`: optional number - maximum number of files to accept

- `options`: optional object of type [`UploadOptions`](src/multipart/options.ts#L4)

### Multiple files

```ts
import { FileFieldsInterceptor, UploadedFiles, MemoryStorageFile } from '@blazity/nest-file-fastify';

@Post('upload')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'avatar', maxCount: 1 },
  { name: 'background', maxCount: 1 },
]))
uploadFile(@UploadedFiles() files: { avatar?: MemoryStorageFile[], background?: MemoryStorageFile[] }) {
  console.log(files);
}
```

`FileFieldsInterceptor` arguments:

- `uploadFields`: object of type [`UploadField`](src/interceptors/file-fields-interceptor.ts#L19)

- `options`: optional object of type [`UploadOptions`](src/multipart/options.ts#L4)

### Any files

```ts
import { AnyFilesInterceptor, UploadedFiles, MemoryStorageFile } from '@blazity/nest-file-fastify';

@Post('upload')
@UseInterceptors(AnyFilesInterceptor()
uploadFile(@UploadedFiles() files: MemoryStorageFile[]) {
  console.log(files);
}
```

`AnyFilesInterceptor` arguments:

- `options`: optional object of type [`UploadOptions`](src/multipart/options.ts#L4)
