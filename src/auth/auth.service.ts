import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  signUp() {
    return {
      message: 'I have signed up.',
    };
  }

  signIn() {
    return {
      message: 'I have signed in.',
    };
  }
}
