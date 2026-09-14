import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto } from './login.dto.js';
import { RegisterDto } from './register.dto.js';
import {
  RequestOtpDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
  VerifyOtpDto,
} from './otp.dto.js';
import { AuthGuard, CurrentUser } from './auth.guards.js';
import type { JwtUser } from './auth.guards.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('password/forgot')
  forgotPassword(@Body() dto: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Post('password/reset')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtUser) {
    return this.authService.getMe(user.sub);
  }

  @UseGuards(AuthGuard)
  @Post('otp/request')
  requestOtp(@CurrentUser() user: JwtUser, @Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(user.sub, dto.channel);
  }

  @UseGuards(AuthGuard)
  @Post('otp/verify')
  verifyOtp(@CurrentUser() user: JwtUser, @Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(user.sub, dto);
  }
}