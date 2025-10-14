import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('knowledge_base')
export class KnowledgeBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  topic: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  category?: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column('text', { nullable: true })
  embedding?: string; // Para pgvector

  @Column({ default: 'manual' })
  source: string;

  @Column({ default: 1 })
  priority: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}