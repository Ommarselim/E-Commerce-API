import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @Length(3, 255)
  username?: string;
}
