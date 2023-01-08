import { INestApplication } from '@nestjs/common/interfaces';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import * as pactum from 'pactum';
import { CreateBookmarkDto } from '../src/bookmark/dto/create-bookmark.dto';
import { EditBookmarkDto } from '../src/bookmark/dto/edit-bookmark.dto';

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
    await prisma.cleanDb();

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
          firstName: 'Vladimir',
          lastName: 'Code'
        };

        return pactum.spec()
          .patch('/users')
          .withHeaders({
            'Authorization': 'Bearer $S{userAccessToken}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
      })
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmark', () => {
      it('Should get empty bookmark', () => {
        return pactum.spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'First bookmark',
        link: 'https://www.youtube.com/watch?v=GHTA143_b-s',
      };

      it('Should create bookmark', () => {
        return pactum.spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('Should get bookmarks', () => {
        return pactum.spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by id', () => {
      it('Should get bookmark by id', () => {
        return pactum.spec()
          .get('/bookmarks/{id}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'NestJs Course for Beginners - Create a REST API',
        description: 'Learn NestJs by building a CRUD REST API with end-to-end tests using modern web development techniques. NestJs is a rapidly growing node js framework that helps build scalable and maintainable backend applications.',
      };

      it('Should edit bookmark by id', () => {
        return pactum.spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
    });

    describe('Delete bookmark', () => {
      it('Should delete bookmark', () => {
        return pactum.spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(204);
      });

      it('Should get empty bookmark', () => {
        return pactum.spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
  });
});
