import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { CommentService } from './comment.service';
import { AddComment } from './dto';
import { JwtAuthGuard } from 'src/auth/guard';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addComment(@GetUser() user: User, @Body() dto: AddComment) {
    return this.commentService.addComment(user.id, dto);
  }

  @Get()
  getComments(@Query('postId') postId: string) {
    return this.commentService.getComments(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  editComment(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() dto: AddComment,
  ) {
    return this.commentService.editComment(user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteComment(@GetUser() user: User, @Param('id') id: string) {
    return this.commentService.deleteComment(user.id, id);
  }
}
