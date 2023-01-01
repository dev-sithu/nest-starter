import { INestApplication } from '@nestjs/common/interfaces';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('App e2e test', () => {
  let app: INestApplication;

  // tear up
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      }
    ));

    await app.init();
  });

  // tear down
  afterAll(() => {
    app.close();
  })

  it.todo('should pass');
  it.todo('should pass 2');
});
