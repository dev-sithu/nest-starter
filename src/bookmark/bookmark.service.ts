import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: {
        userId
      }
    });
  }

  async getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: {
        id: bookmarkId,
        userId,
      }
    })

    if (!bookmark) {
      throw new NotFoundException();
    }

    return bookmark;
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        userId,
        ...dto
      }
    });
  }

  async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    // find bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId
      }
    });

    // check bookmark is belonged to user
    if (!bookmark || (bookmark.userId !== userId)) {
      throw new ForbiddenException('Resource is not allowed to edit');
    }

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        userId,
        ...dto
      }
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    // find bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId
      }
    });

    // check bookmark is belonged to user
    if (!bookmark || (bookmark.userId !== userId)) {
      throw new ForbiddenException('Resource is not allowed to edit');
    }

    return this.prisma.bookmark.delete({
      where: {
        id: bookmarkId
      }
    });
  }
}
