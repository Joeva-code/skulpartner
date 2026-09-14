import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import type { OtpChannel, OtpPurpose } from '@prisma/client';
import { PrismaService } from '../prisma.service.js';
import { LoginDto } from './login.dto.js';
import { RegisterDto } from './register.dto.js';
import {
  OtpChannelValue,
  ResetPasswordDto,
  VerifyOtpDto,
} from './otp.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
    } = registerDto;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException(
        'An account with this email already exists',
      );
    }

    if (phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone },
      });

      if (existingPhone) {
        throw new ConflictException(
          'An account with this phone number already exists',
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.prisma.user.create({
      data: {
        firstName,
        lastName,
        email: normalizedEmail,
        phone,
        passwordHash,
        role: 'PARENT',
      },
    });

    return {
      message: 'Parent account created successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    const trimmed = identifier.trim();
    const normalizedEmail = trimmed.toLowerCase();

    // Identifier can be the issued User ID (PRD: "User ID is used for app login")
    // or the account email address.
    const user = trimmed.includes('@')
      ? await this.prisma.user.findUnique({
          where: { email: normalizedEmail },
        })
      : await this.prisma.user.findUnique({ where: { id: trimmed } });

    if (!user) {
      throw new UnauthorizedException('Invalid login details');
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid login details');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt,
    };
  }

  async requestOtp(userId: string, channel: OtpChannelValue) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (channel === OtpChannelValue.PHONE && !user.phone) {
      throw new UnauthorizedException(
        'Add a phone number before requesting a phone OTP',
      );
    }

    const purpose: OtpPurpose =
      channel === OtpChannelValue.EMAIL ? 'VERIFY_EMAIL' : 'VERIFY_PHONE';

    const code = String(Math.floor(100000 + Math.random() * 900000));

    // Invalidate any previous active codes for the same channel/purpose.
    await this.prisma.otp.updateMany({
      where: {
        userId,
        channel: channel as OtpChannel,
        purpose,
        consumedAt: null,
      },
      data: { consumedAt: new Date() },
    });

    const codeHash = await bcrypt.hash(code, 6);

    await this.prisma.otp.create({
      data: {
        userId,
        channel: channel as OtpChannel,
        purpose,
        codeHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return {
      message: `Verification code sent to your ${
        channel === OtpChannelValue.EMAIL ? 'email' : 'phone'
      }`,
      // TODO: remove in production — replace with a real email/SMS provider.
      devCode: code,
    };
  }

  async verifyOtp(userId: string, dto: VerifyOtpDto) {
    const { channel, code } = dto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const purpose: OtpPurpose =
      channel === OtpChannelValue.EMAIL ? 'VERIFY_EMAIL' : 'VERIFY_PHONE';

    const otp = await this.prisma.otp.findFirst({
      where: {
        userId,
        channel: channel as OtpChannel,
        purpose,
        consumedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new UnauthorizedException('No active OTP. Request a new one');
    }

    if (otp.expiresAt < new Date()) {
      throw new UnauthorizedException('OTP has expired. Request a new one');
    }

    const matches = await bcrypt.compare(code, otp.codeHash);

    if (!matches) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { consumedAt: new Date() },
    });

    const update =
      channel === OtpChannelValue.EMAIL
        ? { emailVerified: true }
        : { phoneVerified: true };

    await this.prisma.user.update({
      where: { id: userId },
      data: update,
    });

    return {
      message: `${
        channel === OtpChannelValue.EMAIL ? 'Email' : 'Phone'
      } verified successfully`,
    };
  }

  private issueCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  private async storeOtp(
    userId: string,
    channel: OtpChannel,
    purpose: OtpPurpose,
  ) {
    await this.prisma.otp.updateMany({
      where: { userId, channel, purpose, consumedAt: null },
      data: { consumedAt: new Date() },
    });

    const code = this.issueCode();
    const codeHash = await bcrypt.hash(code, 6);

    await this.prisma.otp.create({
      data: {
        userId,
        channel,
        purpose,
        codeHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    return code;
  }

  async requestPasswordReset(email: string) {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Always respond the same way so attackers cannot enumerate accounts.
    if (!user) {
      return {
        message: 'If an account exists for this email, a reset code was sent',
        devCode: null as string | null,
      };
    }

    const code = await this.storeOtp(user.id, 'EMAIL', 'RESET_PASSWORD');

    return {
      message: 'If an account exists for this email, a reset code was sent',
      // TODO: remove in production — replace with a real email/SMS provider.
      devCode: code,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid reset code');
    }

    const otp = await this.prisma.otp.findFirst({
      where: {
        userId: user.id,
        channel: 'EMAIL',
        purpose: 'RESET_PASSWORD',
        consumedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new UnauthorizedException('No active reset code. Request a new one');
    }

    if (otp.expiresAt < new Date()) {
      throw new UnauthorizedException('Reset code has expired. Request a new one');
    }

    const matches = await bcrypt.compare(dto.code, otp.codeHash);

    if (!matches) {
      throw new UnauthorizedException('Invalid reset code');
    }

    await this.prisma.otp.update({
      where: { id: otp.id },
      data: { consumedAt: new Date() },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(dto.newPassword, 12) },
    });

    return { message: 'Password reset successfully. Please sign in' };
  }
}