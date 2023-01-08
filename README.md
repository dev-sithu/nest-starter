# NestJs Tutorial Project

Learn NestJs by building a CRUD REST API with end-to-end tests using modern web development techniques. NestJs is a rapidly growing node js framework that helps build scalable and maintainable backend applications.

This project builds a bookmarks API from scratch using 
- [NestJs](https://nestjs.com/)
- [Docker](https://www.docker.com/)
- [PostgresSQL](https://www.postgresql.org/)
- [PassportJs](https://www.passportjs.org/)
- [Prisma](https://www.prisma.io/)
- [PactumJs](https://github.com/pactumjs/pactum)
- [Dotenv](https://www.npmjs.com/package/dotenv-cli)

Resource:
- https://www.youtube.com/watch?v=GHTA143_b-s

## Installation

```bash
$ npm install
```

## Setup env variables

Copy `.env.default` to `.env` and change the content to


    DATABASE_URL="postgresql://postgres:postgrespw@localhost:5432/nest?schema=public"
    JWT_SECRET="nest-super-secret"

Copy `.env.default` to `.env.test` and change the content to


    DATABASE_URL="postgresql://postgres:postgrespw@localhost:5435/nest?schema=public"
    JWT_SECRET="nest-super-secret"

## Database setup with docker

```bash
# development
$ npm run db:dev:restart

# testing
$ npm run db:test:restart
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
