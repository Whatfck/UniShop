import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('training_data')
export class TrainingData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  question: string;

  @Column('text')
  answer: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  intent?: string;

  @Column('jsonb', { default: [] })
  entities: any[];

  @Column('decimal', { precision: 3, scale: 2, default: 0.8 })
  confidenceScore: number;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastUsed?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}