import { Injectable } from '@nestjs/common';
import { AddComment, CommentQueries, EditComment } from './dto';
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

  getComments(query: CommentQueries) {
    return this.prisma.comment.findMany({
      where: {
        postId: query.postId,
        authorId: query.authorId,
      },
      include: {
        author: {
          select: {
            id: true,
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
