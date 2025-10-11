export class CreateModerationDto {
  productId!: number;
  status!: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
}
