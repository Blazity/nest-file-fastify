<div align="left">
  <h1> fastify-multipart for Nest.js</h1>
</div>


这个库为[Nest.js](https://github.com/nestjs/nest)添加了装饰器，以支持[@fastify/multipart](https://github.com/fastify/fastify-multipart)。其 API 与官方的 Nest.js Express 文件装饰器非常相似。


## 安装

NPM

```bash
$ npm install nest-file-fastify @fastify/multipart
```

Yarn

```bash
$ yarn add nest-file-fastify @fastify/multipart
```
pnpm

```bash
$ pnpm install nest-file-fastify @fastify/multipart
```
并在您的 Nest.js 应用程序中注册 multipart 插件

```typescript
import fastyfyMultipart from '@fastify/multipart';

...

app.register(fastyfyMultipart);
```

## 文档

### 单个文件

`FileInterceptor` 参数:

- `fieldname`: string - 包含文件的字段的名称

- `options`: 可选的 [`UploadOptions`](src/multipart/options.ts#L5) 类型对象

```ts
import { FileInterceptor, UploadedFile, MemoryStorageFile } from 'nest-file-fastify';

@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: MemoryStorageFile) {
  console.log(file);
}
```

### 数组文件

`FilesInterceptor` 参数:

- `fieldname`: string - 包含文件的字段的名称
  
- `maxCount`: number - 可选的数字 - 接受的文件的最大数量

- `options`: 可选的 [`UploadOptions`](src/multipart/options.ts#L5) 类型对象
```ts
import { FilesInterceptor, UploadedFiles, MemoryStorageFile } from 'nest-file-fastify';

@Post('upload')
@UseInterceptors(FilesInterceptor('files'))
uploadFile(@UploadedFiles() files: MemoryStorageFile[]) {
  console.log(files);
}
```

### 多个文件

`FileFieldsInterceptor` 参数:

- `uploadFields`: 类型为  [`UploadField`](src/multipart/handlers/file-fields.ts#L11) 的数组对象

- `options`: 可选的 [`UploadOptions`](src/multipart/options.ts#L5) 类型对象
```ts


import { FileFieldsInterceptor, UploadedFiles, MemoryStorageFile } from 'nest-file-fastify';

@Post('upload')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'avatar', maxCount: 1 },
  { name: 'background', maxCount: 1 },
]))
uploadFile(@UploadedFiles() files: { avatar?: MemoryStorageFile[], background?: MemoryStorageFile[] }) {
  console.log(files);
}
```


### 任意文件

`AnyFilesInterceptor` 参数:

- `options`: 可选的 [`UploadOptions`](src/multipart/options.ts#L5) 类型对象


```ts
import { AnyFilesInterceptor, UploadedFiles, MemoryStorageFile } from 'nest-file-fastify';

@Post('upload')
@UseInterceptors(AnyFilesInterceptor()
uploadFile(@UploadedFiles() files: MemoryStorageFile[]) {
  console.log(files);
}
```

