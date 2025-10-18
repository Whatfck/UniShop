import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity('metrics')
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: "varchar", nullable: true })
  productId: number;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  contacts: number;

  @CreateDateColumn()
  createdAt: Date;
}
