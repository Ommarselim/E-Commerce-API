import { Review } from 'src/reviews/Entities/review.entity';
import { User } from 'src/users/Entities/user.entity';
import { CURRENT_TIMESTAMP } from 'src/utilities/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column()
  description: string;

  @Column('decimal')
  price: number;

  @CreateDateColumn({ type: 'timestamp', default: () => CURRENT_TIMESTAMP })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @ManyToOne(() => User, user => user.products, { eager: true })
  user: User;
}
