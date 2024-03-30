import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { EditProfileDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@GetUser() user: User) {
    return this.userService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('edit')
  editProfile(@GetUser() user: User, @Body() dto: EditProfileDto) {
    return this.userService.editProfile(user.id, dto);
  }
}
