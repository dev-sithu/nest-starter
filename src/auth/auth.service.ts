import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);

    try {
      // save the new user in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash
        }
      });

      delete user.hash;

      // return the saved user
      return user; 
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Email already taken. Try another one.');
        }
      }

      throw error;
    }
  }

  async signIn(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      }
    })

    // if user doesn't exist, throw exception
    if (!user) {
      throw new BadRequestException('User does not exist.');
    }

    // compare password
    const isPwdMatched = await argon.verify(user.hash, dto.password);
    // if password incorrect, throw exception
    if (!isPwdMatched) {
      throw new BadRequestException('Password incorrect.');
    }

    // send back the user
    delete user.hash;

    return user;
  }
}
