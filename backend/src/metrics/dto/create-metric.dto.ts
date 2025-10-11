export class CreateMetricDto {
  productId!: number;
  userId?: number;
  type!: 'view' | 'contact';
  timestamp?: Date;
}
