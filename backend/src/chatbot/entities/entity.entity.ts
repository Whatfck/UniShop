import { Entity as TypeOrmEntity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@TypeOrmEntity('entities')
export class Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entityName: string;

  @Column()
  entityType: string;

  @Column('text')
  entityValue: string;

  @Column('text', { array: true, default: [] })
  synonyms: string[];

  @Column('decimal', { precision: 3, scale: 2, default: 1.0 })
  confidence: number;

  @CreateDateColumn()
  createdAt: Date;
}