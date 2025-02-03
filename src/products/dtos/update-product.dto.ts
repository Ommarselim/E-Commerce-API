import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  description?: string;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  price?: number;
}
