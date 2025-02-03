import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

type ProductDto = { id: number; name: string; price: number };

@Injectable()
export class ProductsService {
  private products: ProductDto[] = [
    { id: 1, name: 'Laptop', price: 1000 },
    { id: 2, name: 'Phone', price: 500 },
  ];

  getAll(): ProductDto[] {
    return this.products;
  }

  getById(id: number): ProductDto | undefined {
    return this.products.find(p => p.id === id);
  }

  create(createProductDto: CreateProductDto): ProductDto {
    const newProduct: ProductDto = {
      id: this.products.length + 1,
      ...createProductDto,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, updateProductDto: UpdateProductDto): ProductDto | string {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return 'Product not found';
    }
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updateProductDto,
    };
    return this.products[productIndex];
  }
}
