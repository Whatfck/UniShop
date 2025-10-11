import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Metric } from './entities/metric.entity';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(Metric)
    private readonly metricRepository: Repository<Metric>,
  ) {}

  async incrementViews(productId: number): Promise<void> {
    let metric = await this.metricRepository.findOneBy({ productId });
    if (!metric) {
      metric = this.metricRepository.create({ productId, views: 1 });
    } else {
      metric.views += 1;
    }
    await this.metricRepository.save(metric);
  }

  async incrementContacts(productId: number): Promise<void> {
    let metric = await this.metricRepository.findOneBy({ productId });
    if (!metric) {
      metric = this.metricRepository.create({ productId, contacts: 1 });
    } else {
      metric.contacts += 1;
    }
    await this.metricRepository.save(metric);
  }

  async getMetrics(productId: number): Promise<Metric | null> {
    return this.metricRepository.findOneBy({ productId });
  }

  async getAllMetrics(): Promise<Metric[]> {
    return this.metricRepository.find({ relations: ['product'] });
  }
}
