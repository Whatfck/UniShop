import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 12 Pro', description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'Teléfono en excelente estado, usado menos de 6 meses', description: 'Descripción detallada del producto' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  @ApiProperty({ example: 1200000, description: 'Precio en pesos colombianos (mínimo 1000)' })
  @IsNumber()
  @Min(1000, { message: 'El precio mínimo es de 1000 pesos' })
  price!: number;

  @ApiProperty({ example: 1, description: 'ID de la categoría del producto (debe existir)' })
  @IsNumber()
  @IsPositive()
  categoryId!: number;

  @ApiProperty({
    example: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    description: 'URLs de las imágenes del producto (mínimo 1, máximo 5)'
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5, { message: 'No se permiten más de 5 imágenes' })
  @IsUrl({}, { each: true })
  images!: string[];

  @ApiProperty({ required: false, example: 'user-uuid-123', description: 'ID del usuario que publica (opcional, se obtiene del token JWT)' })
  @IsOptional()
  @IsString()
  userId?: string;
}
