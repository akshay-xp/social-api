import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('follow')
export class FollowController {
  constructor(private followService: FollowService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  addFollow(@GetUser() user: User, @Param('id') id: string) {
    return this.followService.addFollow(user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeFollow(@GetUser() user: User, @Param('id') id: string) {
    return this.followService.removeFollow(user.id, id);
  }
}
