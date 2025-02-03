import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
