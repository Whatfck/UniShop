import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, email, ...userData } = createUserDto;

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException(`El correo '${email}' ya está en uso.`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({ ...userData, email, password: hashedPassword });
    await this.userRepository.save(user);

    delete user.password; // Nunca devolver la contraseña en la respuesta
    return user;
  }

  async login(loginDto: LoginDto): Promise<{ user: User; message: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    delete user.password; // No devolver la contraseña
    return { user, message: 'Inicio de sesión exitoso.' };
  }
}
