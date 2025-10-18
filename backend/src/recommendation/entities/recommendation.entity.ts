import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('recommendations')
export class Recommendation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", nullable: true })
  userId!: number;

  @Column({ type: "varchar", nullable: true })
  productId!: number;

  @Column({ nullable: true })
  reason?: string;
}
