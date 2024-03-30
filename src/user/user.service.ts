import { Injectable } from '@nestjs/common';
import { GetProfileDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getProfile(dto: GetProfileDto) {
    console.log(dto);
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.id,
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
