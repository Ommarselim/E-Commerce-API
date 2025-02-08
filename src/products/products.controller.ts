import { Controller, Get, Param, Post, Put, Body, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { AuthRolesGuard } from 'src/users/guards/auth-roles.guard';
import { Roles } from 'src/users/decorators/roles.decorator';
import { UserRole } from 'src/utilities/enums';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { JWTPayloadType } from 'src/utilities/types';

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

  @Roles(UserRole.ADMIN)
  @UseGuards(AuthRolesGuard)
  @Post() 
  create(@Body() createProductDto: CreateProductDto , @CurrentUser() payload: JWTPayloadType) {
    return this.productService.create(createProductDto , payload.userId);
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
