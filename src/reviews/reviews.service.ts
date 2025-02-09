import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './Entities/review.entity';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dtos/create-review.dto';
import { ProductsService } from 'src/products/products.service';
import { UpdateReviewDto } from './dtos/update-review.dto';
import { JWTPayloadType } from 'src/utilities/types';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    private readonly usersService: UsersService, // ✅ Fixed naming (lowercase `u`)
    private readonly productsService: ProductsService,
  ) {}

  public async create(
    createReviewDto: CreateReviewDto,
    productId: number,
    userId: number,
  ) {
    // Fetch the product
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }
    // Fetch the user
    const user = await this.usersService.getCurrentUser(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    // Create a new review
    const review = this.reviewsRepository.create({
      ...createReviewDto,
      user,
      product,
    });
    // Save and return the review
    const result = await this.reviewsRepository.save(review);
    return {
      id: result.id,
      comment: result.comment,
      rating: result.rating,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      productId: product.id,
      userId: user.id,
    };
  }

  public async getReviewsByProductId(productId: number): Promise<Review[]> {
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found.`);
    }
    return product.reviews;
  }
  public async findAll(
    pageNumber: number,
    reviewPerPage: number,
  ): Promise<Review[]> {
    if (pageNumber < 1) {
      pageNumber = 1;
    }
    return this.reviewsRepository.find({
      take: reviewPerPage,
      skip: (pageNumber - 1) * reviewPerPage,
    });
  }

  public async findOne(id: number): Promise<Review> {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    return review;
  }
  public async delete(id: number, payload: JWTPayloadType): Promise<any> {
    const review = await this.findOne(id);
    if (review.user.id !== payload.userId && payload.role !== 'admin') {
      throw new BadRequestException('You can only delete your review');
    }
    await this.reviewsRepository.delete(id);
    return { message: `Review #${id} deleted` };
  }

  public async update(id: number, updateReviewDto: UpdateReviewDto) {
    await this.reviewsRepository.update(id, updateReviewDto);
    return { message: `Review #${id} updated` };
  }
}
