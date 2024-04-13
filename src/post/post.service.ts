import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto';
import { EditPostDto } from './dto/edit-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(userId: string, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        ...dto,
        posterId: userId,
      },
    });

    return post;
  }

  async getPosts(posterId?: string) {
    if (posterId) {
      return await this.prisma.post.findMany({
        where: {
          posterId,
        },
      });
    }
    return await this.prisma.post.findMany({
      include: {
        poster: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  async getPost(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        poster: {
          select: {
            username: true,
          },
        },
      },
    });
    return post;
  }

  async editPost(posterId: string, postId: string, dto: EditPostDto) {
    const post = await this.prisma.post.update({
      where: {
        id: postId,
        posterId,
      },
      data: {
        ...dto,
      },
    });
    return post;
  }

  async deletePost(posterId: string, postId: string) {
    const post = await this.prisma.post.delete({
      where: {
        id: postId,
        posterId,
      },
    });
    return post;
  }
}
