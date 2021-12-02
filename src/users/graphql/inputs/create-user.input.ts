import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail({}, { message: 'This is email is incorrect' })
  email: string;

  @Field()
  @MinLength(4, { message: 'Password cannot be less than 4 digits' })
  password: string;
}
