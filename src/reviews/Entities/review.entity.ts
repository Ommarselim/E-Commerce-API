import { Product } from 'src/products/Entities/product.entity';
import { User } from 'src/users/Entities/user.entity';
import { CURRENT_TIMESTAMP } from 'src/utilities/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'varchar', length: 500 })
  comment: string;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
  @ManyToOne(() => Product, product => product.reviews , { eager: true , onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => User, user => user.reviews, { eager: true, onDelete: 'CASCADE' })
  user: User;
}
