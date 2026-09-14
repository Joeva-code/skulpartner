import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, CurrentUser } from '../auth/auth.guards.js';
import type { JwtUser } from '../auth/auth.guards.js';
import { OnboardingService } from './onboarding.service.js';
import {
  ConsentDto,
  CreateBeneficiaryDto,
  KycDto,
  NextOfKinDto,
  SchoolSearchDto,
} from './dtos.js';

@UseGuards(AuthGuard)
@Controller()
export class OnboardingController {
  constructor(private readonly onboarding: OnboardingService) {}

  @Get('onboarding/status')
  status(@CurrentUser() user: JwtUser) {
    return this.onboarding.getStatus(user.sub);
  }

  @Get('kyc')
  kyc(@CurrentUser() user: JwtUser) {
    return this.onboarding.getKyc(user.sub);
  }

  @Put('kyc')
  upsertKyc(@CurrentUser() user: JwtUser, @Body() dto: KycDto) {
    return this.onboarding.upsertKyc(user.sub, dto);
  }

  @Post('kyc/submit')
  submitKyc(@CurrentUser() user: JwtUser) {
    return this.onboarding.submitKyc(user.sub);
  }

  @Get('schools')
  schools(@CurrentUser() _user: JwtUser, @Query() query: SchoolSearchDto) {
    return this.onboarding.searchSchools(query?.search);
  }

  @Get('beneficiaries')
  beneficiaries(@CurrentUser() user: JwtUser) {
    return this.onboarding.listBeneficiaries(user.sub);
  }

  @Post('beneficiaries')
  createBeneficiary(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateBeneficiaryDto,
  ) {
    return this.onboarding.createBeneficiary(user.sub, dto);
  }

  @Get('next-of-kin')
  nextOfKin(@CurrentUser() user: JwtUser) {
    return this.onboarding.getNextOfKin(user.sub);
  }

  @Put('next-of-kin')
  upsertNextOfKin(
    @CurrentUser() user: JwtUser,
    @Body() dto: NextOfKinDto,
  ) {
    return this.onboarding.upsertNextOfKin(user.sub, dto);
  }

  @Post('consent')
  consent(@CurrentUser() user: JwtUser, @Body() dto: ConsentDto) {
    return this.onboarding.consent(user.sub, dto);
  }
}