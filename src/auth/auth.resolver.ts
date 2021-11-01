import { CreateUserInput } from './../users/graphql/inputs/create-user.input';
import { UserType } from './../users/graphql/types/user.type';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver(() => String)
export class AuthResolver {
  constructor(private readonly _authService: AuthService) {}

  @Query(() => String, {
    description: 'Returns pong',
  })
  async ping(): Promise<string> {
    return 'pong';
  }
  @Mutation(() => UserType)
  async signUp(@Args('input') input: CreateUserInput): Promise<UserType> {
    const response = await this._authService.signUp(input);
    return response;
  }
}
