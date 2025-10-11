import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column('decimal')
  price!: number;

  @Column()
  categoryId!: number;

  @Column('simple-array')
  images!: string[];

  @Column({ default: 'ACTIVE' })
  status!: 'ACTIVE' | 'SOLD' | 'INACTIVE';

  // Relaciones con usuario, categoría, etc. se agregarán después
}
