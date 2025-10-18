import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';

export enum ModerationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('moderations')
export class Moderation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: "varchar", nullable: true })
  productId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'moderatorId' })
  moderator: User;

  @Column({ type: "varchar", nullable: true })
  moderatorId: string;

  @Column({ type: 'enum', enum: ModerationStatus, default: ModerationStatus.PENDING })
  status: ModerationStatus;

  @Column('text', { nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
