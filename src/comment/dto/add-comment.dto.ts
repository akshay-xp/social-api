import { IsString, IsUUID, MaxLength } from 'class-validator';

export class AddComment {
  @IsString()
  @MaxLength(100)
  content: string;

  @IsUUID()
  postId: string;
}
