import { Entity as TypeOrmEntity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@TypeOrmEntity('entities')
export class Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: true })
  entityName: string;

  @Column({ type: "varchar", nullable: true })
  entityType: string;

  @Column({ type: 'text' })
  entityValue: string;

  @Column('text', { array: true, default: [] })
  synonyms: string[];

  @Column({ type: 'decimal', { precision: 3, scale: 2, default: 1.0 })
  confidence: number;

  @CreateDateColumn()
  createdAt: Date;
}