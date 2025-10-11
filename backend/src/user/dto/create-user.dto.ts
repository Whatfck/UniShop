import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Nombre completo del usuario' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john.doe@miuniversidad.edu.co', description: 'Correo institucional del usuario' })
  @IsEmail()
  @Matches(/@miuniversidad\.edu\.co$/, { message: 'El correo debe ser institucional (@miuniversidad.edu.co)' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Contraseña del usuario (mínimo 8 caracteres)' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({ required: false, description: 'URL de la foto de perfil (opcional)' })
  @IsOptional()
  @IsUrl({}, { message: 'La URL de la foto de perfil no es válida' })
  profilePictureUrl?: string;
}