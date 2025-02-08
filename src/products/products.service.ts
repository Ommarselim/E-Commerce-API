import { UsersService } from './../users/users.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { Repository } from 'typeorm';
import { Product } from './Entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly usersService: UsersService,
  ) {}

  async create(createProductDto: CreateProductDto, id: number) {
    const user = await this.usersService.getCurrentUser(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const newProduct = this.productsRepository.create({
      ...createProductDto,
      title: createProductDto.title.toLowerCase(),
      user,
    });
    return this.productsRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    this.productsRepository.merge(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<any> {
    await this.findOne(id);
    await this.productsRepository.delete(id);
    return { message: `Product #${id} deleted` };
  }
}
