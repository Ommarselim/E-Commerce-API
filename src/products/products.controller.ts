import { Controller, Get, Param, Post, Put, Body, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Controller('/api/products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  getAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.productService.findOne(Number(id));
  }

  @Post() 
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(Number(id), updateProductDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productService.remove(Number(id));
  }
  

}
