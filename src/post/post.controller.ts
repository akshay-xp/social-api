import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from '@prisma/client';
import { CreatePostDto } from './dto';
import { EditPostDto } from './dto/edit-post.dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@GetUser() user: User, @Body() dto: CreatePostDto) {
    return this.postService.createPost(user.id, dto);
  }

  @Get()
  getPosts(@Query('posterId') posterId?: string) {
    return this.postService.getPosts(posterId);
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postService.getPost(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  editPost(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: EditPostDto,
  ) {
    return this.postService.editPost(user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePost(@GetUser() user: User, @Param('id') id: string) {
    return this.postService.deletePost(user.id, id);
  }
}
