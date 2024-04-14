import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CommentQueries {
  @IsString()
  @IsOptional()
  @IsUUID()
  postId?: string;

  @IsString()
  @IsOptional()
  @IsUUID()
  authorId?: string;
}
