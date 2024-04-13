import { Injectable } from '@nestjs/common';
import { AddComment, EditComment } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  addComment(userId: string, dto: AddComment) {
    return this.prisma.comment.create({
      data: {
        ...dto,
        authorId: userId,
      },
    });
  }

  getComments(postId: string) {
    return this.prisma.comment.findMany({
      where: {
        postId,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  editComment(userId: string, commentId: string, dto: EditComment) {
    return this.prisma.comment.update({
      data: {
        ...dto,
      },
      where: {
        id: commentId,
        authorId: userId,
      },
    });
  }

  deleteComment(userId: string, commentId: string) {
    return this.prisma.comment.delete({
      where: {
        id: commentId,
        authorId: userId,
      },
    });
  }
}
