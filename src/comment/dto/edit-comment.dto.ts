import { IsString, MaxLength } from 'class-validator';

export class EditComment {
  @IsString()
  @MaxLength(100)
  content: string;
}
