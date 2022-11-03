import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataWrapperInterceptor } from './@shared/interceptors/data-wrapper.interceptor';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalInterceptors(
    new DataWrapperInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
}
