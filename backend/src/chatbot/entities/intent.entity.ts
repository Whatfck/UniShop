import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('intents')
export class Intent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  intentName: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('text', { array: true, default: [] })
  trainingExamples: string[];

  @Column('text', { array: true, default: [] })
  responseTemplates: string[];

  @Column('text', { array: true, default: [] })
  followUpQuestions: string[];

  @Column({ default: 1 })
  priority: number;

  @CreateDateColumn()
  createdAt: Date;
}