import { INestApplication } from '@nestjs/common/interfaces';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('App e2e test', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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

    prisma = app.get(PrismaService);
    prisma.cleanDb();
  });

  // tear down
  afterAll(() => {
    app.close();
  })

  it.todo('should pass');
});
