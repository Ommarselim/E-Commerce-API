import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
