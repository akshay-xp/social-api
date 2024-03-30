import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class EditProfileDto {
  @IsString()
  @MaxLength(30)
  @IsOptional()
  @IsNotEmpty()
  username?: string;

  @IsEmail()
  @MaxLength(255)
  @IsOptional()
  email?: string;

  @IsString()
  @MaxLength(50)
  @IsAlpha()
  @IsOptional()
  fullname?: string;

  @IsString()
  @MaxLength(150)
  @IsOptional()
  bio?: string;
}
