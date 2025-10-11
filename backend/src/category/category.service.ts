import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(name: string, description?: string): Promise<Category> {
    const category = this.categoryRepository.create({ name, ...(description && { description }) });
    return this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category | null> {
    return this.categoryRepository.findOneBy({ id });
  }

  async update(id: number, name?: string, description?: string): Promise<Category | null> {
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    await this.categoryRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
