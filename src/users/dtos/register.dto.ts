import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Max, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6) 
  password: string;

  @IsOptional()
  @Length(3, 255)
  username: string;
}
