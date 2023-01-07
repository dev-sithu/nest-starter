import { INestApplication } from '@nestjs/common/interfaces';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import * as pactum from 'pactum';

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
    await app.listen(3333);

    prisma = app.get(PrismaService);
    prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  // tear down
  afterAll(() => {
    app.close();
  })

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'dummy@example.com',
      password: 'password'
    };

    describe('Signup', () => {
      it('Should throw if email empty', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
      });

      it('Should throw if password empty', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
      });

      it('Should throw if no body provided', () => {
        return pactum.spec()
          .post('/auth/signup')
          .expectStatus(400)
      });

      it('Should signup', () => {
        return pactum.spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      });
    });

    describe('Signin', () => {
      it('Should throw if email empty', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
      });

      it('Should throw if password empty', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
      });

      it('Should throw if no body provided', () => {
        return pactum.spec()
          .post('/auth/signin')
          .expectStatus(400)
      });

      it('Should signin', () => {
        return pactum.spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'accessToken');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get the current user', () => {
        return pactum.spec()
          .get('/users/me')
          .withHeaders({
            'Authorization': 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      it('Should update user', () => {
        const dto: EditUserDto = {
          email: 'vlad@gmail.com',
          firstName: 'Vlad',
        };

        return pactum.spec()
          .patch('/users')
          .withHeaders({
            'Authorization': 'Bearer $S{userAccessToken}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName)
      })
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmarks', () => {});

    describe('Get bookmark by id', () => {});

    describe('Get bookmarks', () => {});

    describe('Delete bookmark', () => {});
  });
});
