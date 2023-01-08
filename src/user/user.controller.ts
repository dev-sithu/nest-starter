import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client';
import { GetUser } from "../auth/decorator";
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * GET /users/me
   */
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  /**
   * PATCH /users
   */
  @Patch()
  edit(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto
  ) {
    // @GetUser() decorator will return request.user injected by src/auth/strategy/jwt.strategy.ts -> validate()
    return this.userService.updateUser(userId, dto);
  }
}
