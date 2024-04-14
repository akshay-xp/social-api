import { Injectable } from '@nestjs/common';
import { EditProfileDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string, followerId?: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        username: true,
        fullname: true,
        bio: true,
        following: {
          where: { followerId },
          take: 1,
        },
      },
    });

    return user;
  }

  async editProfile(userId: string, dto: EditProfileDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
      select: {
        email: true,
        username: true,
        fullname: true,
        bio: true,
      },
    });

    return user;
  }
}
