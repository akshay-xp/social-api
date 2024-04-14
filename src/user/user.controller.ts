import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { EditProfileDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUser(@GetUser() user: User) {
    return this.userService.getProfile(user.id);
  }

  @Get(':id')
  getProfile(
    @Param('id') id: string,
    @Query('folllowerId') folllowerId?: string,
  ) {
    return this.userService.getProfile(id, folllowerId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('edit')
  editProfile(@GetUser() user: User, @Body() dto: EditProfileDto) {
    return this.userService.editProfile(user.id, dto);
  }
}
