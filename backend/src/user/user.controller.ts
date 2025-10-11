import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 409, description: 'El correo ya está en uso.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
}