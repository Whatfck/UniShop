import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('chatbot_metrics')
export class ChatbotMetrics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', unique: true })
  date: Date;

  @Column({ default: 0 })
  totalConversations: number;

  @Column({ default: 0 })
  successfulResponses: number;

  @Column({ type: 'decimal', { precision: 6, scale: 2, nullable: true })
  averageResponseTime?: number;

  @Column({ type: 'decimal', { precision: 3, scale: 2, nullable: true })
  averageUserSatisfaction?: number;

  @Column('jsonb', { default: {} })
  topIntents: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}