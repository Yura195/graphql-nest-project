import { IsEmail, MinLength } from 'class-validator';

export class UserDto {
  @IsEmail({}, { message: 'This is email is incorrect' })
  readonly email: string;
  @MinLength(4, { message: 'Password cannot be less than 4 digits' })
  readonly password: string;
}
