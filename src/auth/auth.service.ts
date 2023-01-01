import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

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

      return this.signToken(user.id, user.email);
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

    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    })

    return {
      accessToken: token
    };
  }
}
