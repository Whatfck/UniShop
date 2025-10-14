import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, IsEnum, ArrayMaxSize } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsEnum(['ACTIVE', 'SOLD', 'INACTIVE'])
  status?: 'ACTIVE' | 'SOLD' | 'INACTIVE';

  @IsOptional()
  @ArrayMaxSize(5, { message: 'No se permiten más de 5 imágenes' })
  images?: string[];
}
