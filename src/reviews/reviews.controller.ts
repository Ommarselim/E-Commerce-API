import { AuthGuard } from './../users/guards/auth.guard';
import {
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Post, Get, Body, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/create-review.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayloadType } from 'src/utilities/types';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { Roles } from 'src/users/decorators/roles.decorator';
import { UserRole } from 'src/utilities/enums';

@Controller('/api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthGuard)
  @Post('/:id')
  create(
    @Body() createReviewDto: CreateReviewDto,
    @Param('id', ParseIntPipe) productId: number,
    @CurrentUser() payload: JWTPayloadType,
  ) {
    return this.reviewsService.create(
      createReviewDto,
      productId,
      payload.userId,
    );
  }

  @Get()
  findAll(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('reviewPerPage', ParseIntPipe) reviewPerPage: number,
  ) {
    return this.reviewsService.findAll(pageNumber, reviewPerPage);
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.findOne(id);
  }


  @UseGuards(AuthRolesGuard)
  @Roles(UserRole.ADMIN , UserRole.USER)
  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number , @CurrentUser() payload: JWTPayloadType) {
    return this.reviewsService.delete(id, payload);
  }

  @Put('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(id, updateReviewDto);
  }
}
