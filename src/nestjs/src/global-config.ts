import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataWrapperInterceptor } from './@shared/interceptors/data-wrapper.interceptor';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );
  app.useGlobalInterceptors(
    new DataWrapperInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
}
