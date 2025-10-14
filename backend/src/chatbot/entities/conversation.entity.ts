import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sessionId: string;

  @Column({ nullable: true })
  userId?: string;

  @Column('text')
  userMessage: string;

  @Column('text')
  botResponse: string;

  @Column({ nullable: true })
  intentDetected?: string;

  @Column('jsonb', { default: [] })
  entitiesExtracted: any[];

  @Column({ type: 'int', nullable: true })
  responseTimeMs?: number;

  @Column({ type: 'int', nullable: true })
  userFeedback?: number;

  @Column({ nullable: true })
  wasHelpful?: boolean;

  @CreateDateColumn()
  timestamp: Date;
}