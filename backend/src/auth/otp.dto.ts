import { IsEmail, IsEnum, IsString, Length, MinLength } from 'class-validator';

export enum OtpChannelValue {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
}

export class RequestOtpDto {
  @IsEnum(OtpChannelValue)
  channel: OtpChannelValue;
}

export class RequestPasswordResetDto {
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
  @IsEnum(OtpChannelValue)
  channel: OtpChannelValue;

  @IsString()
  @Length(6, 6)
  code: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  code: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}