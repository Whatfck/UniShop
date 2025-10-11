import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(name: string): Promise<Tag> {
    const tag = this.tagRepository.create({ name });
    return this.tagRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async findOne(id: number): Promise<Tag | null> {
    return this.tagRepository.findOneBy({ id });
  }

  async update(id: number, name: string): Promise<Tag | null> {
    await this.tagRepository.update(id, { name });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.tagRepository.delete(id);
  }
}
