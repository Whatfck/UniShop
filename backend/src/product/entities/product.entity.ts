import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import { Metric } from '../../metrics/entities/metric.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: true })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: "varchar", nullable: true })
  categoryId!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: "varchar", nullable: true })
  userId!: string;

  @Column({ type: 'simple-array' })
  images!: string[];

  @Column({ type: 'enum', enum: ['ACTIVE', 'SOLD', 'INACTIVE'], default: 'ACTIVE' })
  status!: 'ACTIVE' | 'SOLD' | 'INACTIVE';

  @OneToMany(() => Metric, (metric) => metric.product)
  metrics?: Metric[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
