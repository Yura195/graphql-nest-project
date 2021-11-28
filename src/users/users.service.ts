import { UserEntity } from './entities/users.entity';
import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { genSalt, hash, compare } from 'bcryptjs';
import { UserDto } from './dtos/user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class UsersService implements OnModuleInit {
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
    const { email, password } = input;
    const candidate = await this.getUserByEmail(email);
    if (candidate) {
      throw new Error('This user with email ' + email + ' already exists');
    }
    const user = this._usersRepository.create({
      password: await this.hashPassword(password),
      email,
    });
    return await this._usersRepository.save(user);
  }

  async login(input: UserDto): Promise<UserEntity> {
    const { email, password } = input;

    const user = await this._usersRepository.findOne({
      email,
    });

    if (!user) {
      throw new Error('User not found');
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }
    return user;
  }

  protected async hashPassword(password: string): Promise<string> {
    const ROUNDS = 12;
    const salt = await genSalt(ROUNDS);
    const hashedPassword = await hash(password, salt);

    return hashedPassword;
  }
  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this._usersRepository.findOne({ email });
    return user;
  }
}
