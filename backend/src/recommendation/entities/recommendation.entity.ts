import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  productId!: number;

  @Column({ nullable: true })
  reason?: string;
}
