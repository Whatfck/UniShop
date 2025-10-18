import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Conversation } from './conversation.entity';

@Entity('user_feedback')
export class UserFeedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Conversation)
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Column({ type: "varchar", nullable: true })
  conversationId: number;

  @Column({ type: "varchar", nullable: true })
  userId: string;

  @Column({ type: 'int' })
  rating: number;

  @Column('text', { nullable: true })
  comments?: string;

  @Column('text', { nullable: true })
  suggestedImprovement?: string;

  @CreateDateColumn()
  createdAt: Date;
}