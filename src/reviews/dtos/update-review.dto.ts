import { IsNotEmpty, IsNumber, IsOptional,IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsString()
  comment?: string;
}
