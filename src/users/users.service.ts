import { UserEntity } from './entities/users.entity';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { UserDto } from './dtos/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class UsersService implements OnModuleInit {
  private _logger = new Logger(UsersService.name);
  private _circularDependencyService: AuthService;
  constructor(
    @InjectRepository(UserEntity)
    private readonly _usersRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private readonly _authService: AuthService,
    private _moduleRef: ModuleRef,
  ) {}
  onModuleInit() {
    this._circularDependencyService = this._moduleRef.get(AuthService, {
      strict: false,
    });
  }

  async createUser(input: UserDto): Promise<UserEntity> {
    try {
      const { email, password } = input;
      const user = this._usersRepository.create({
        password: await this.hashPassword(password),
        email,
      });
      return await this._usersRepository.save(user);
    } catch (error) {
      this._logger.error(error, 'createUser method error');
      throw new InternalServerErrorException(error);
    }
  }
  protected async hashPassword(password: string): Promise<string> {
    const ROUNDS = 12;
    const salt = await genSalt(ROUNDS);
    const hashedPassword = await hash(password, salt);

    return hashedPassword;
  }
  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this._usersRepository.findOne({ where: email });
    return user;
  }
}
