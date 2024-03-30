import { IsUUID } from 'class-validator';

export class GetProfileDto {
  @IsUUID()
  id: string;
}
