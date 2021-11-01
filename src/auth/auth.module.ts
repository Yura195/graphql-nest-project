import { AuthResolver } from './auth.resolver';
import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, forwardRef(() => UsersModule)],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
