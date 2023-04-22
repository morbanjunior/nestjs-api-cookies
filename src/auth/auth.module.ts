import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwt_refreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, jwt_refreshStrategy, JwtStrategy]
})
export class AuthModule {}
