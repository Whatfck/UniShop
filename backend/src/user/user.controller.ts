import { Controller, Post, Body, Get, Param, Patch, Delete, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  @Get('profile/:id')
  @ApiOperation({ summary: 'Obtener perfil público de un usuario' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido exitosamente.' })
  getProfile(@Param('id') id: string) {
    return this.userService.getProfile(id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mi perfil' })
  getMyProfile(@Request() req: any) {
    const userId = req.user.id;
    return this.userService.getProfile(userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar mi perfil' })
  updateProfile(@Body() updateData: { name?: string; profilePictureUrl?: string }, @Request() req: any) {
    const userId = req.user.id;
    return this.userService.updateProfile(userId, updateData);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña' })
  changePassword(@Body() body: { currentPassword: string; newPassword: string }, @Request() req: any) {
    const userId = req.user.id;
    return this.userService.changePassword(userId, body.currentPassword, body.newPassword);
  }

  @Get('stats/:userId')
  @ApiOperation({ summary: 'Obtener estadísticas detalladas de un vendedor' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente.' })
  getUserStats(@Param('userId') userId: string) {
    return this.userService.getUserStatistics(userId);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mis estadísticas de vendedor' })
  getMyStats(@Request() req: any) {
    const userId = req.user.id;
    return this.userService.getUserStatistics(userId);
  }
}