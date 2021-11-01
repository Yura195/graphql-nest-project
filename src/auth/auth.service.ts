import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserDto } from 'src/users/dtos/user.dto';
import { UserEntity } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly _usersService: UsersService,
  ) {}

  async signUp(input: UserDto): Promise<UserEntity> {
    const user = await this._usersService.createUser(input);
    return user;
  }
}
