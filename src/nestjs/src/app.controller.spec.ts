import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [ConfigModule.forRoot()],
    }).compile();

    appController = app.get<AppController>(AppController);

    // const configService: ConfigService =
    //   app.get<ConfigService<CONFIG_SCHEMA_TYPE>>(ConfigService);

    // const db_vendor =
    //   configService.get<CONFIG_SCHEMA_TYPE['DB_VENDOR']>('DB_VENDOR');
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
