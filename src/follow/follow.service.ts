import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private prisma: PrismaService) {}

  addFollow(followerId: string, followingId: string) {
    return this.prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  removeFollow(followerId: string, followingId: string) {
    return this.prisma.follow.delete({
      where: {
        followingId_followerId: {
          followerId,
          followingId,
        },
      },
    });
  }
}
