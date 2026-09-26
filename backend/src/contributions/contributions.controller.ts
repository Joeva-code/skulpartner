import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, CurrentUser } from '../auth/auth.guards.js';
import type { JwtUser } from '../auth/auth.guards.js';
import { ContributionsService } from './contributions.service.js';
import {
  CreateContributionDto,
  ListContributionsQueryDto,
  ListWalletTransactionsQueryDto,
} from './dtos.js';

@UseGuards(AuthGuard)
@Controller()
export class ContributionsController {
  constructor(private readonly contributions: ContributionsService) {}

  /** Pricing constants + settings-derived fees, for the contribute form. */
  @Get('contributions/config')
  config(@CurrentUser() _user: JwtUser) {
    return this.contributions.getConfig();
  }

  @Get('contributions/summary')
  summary(@CurrentUser() user: JwtUser) {
    return this.contributions.getSummary(user.sub);
  }

  @Get('contributions')
  list(
    @CurrentUser() user: JwtUser,
    @Query() query: ListContributionsQueryDto,
  ) {
    return this.contributions.list(user.sub, query);
  }

  @Get('contributions/:id')
  findOne(@CurrentUser() user: JwtUser, @Param('id') id: string) {
    return this.contributions.findOne(id, user.sub);
  }

  /** Preview the fees for a beneficiary before committing. */
  @Get('contributions/quote/:beneficiaryId')
  quote(
    @CurrentUser() user: JwtUser,
    @Param('beneficiaryId') beneficiaryId: string,
  ) {
    return this.contributions.quote(beneficiaryId, user.sub);
  }

  @Post('contributions')
  create(
    @CurrentUser() user: JwtUser,
    @Body() dto: CreateContributionDto,
  ) {
    return this.contributions.create(user.sub, dto);
  }

  @Get('wallet')
  wallets(@CurrentUser() user: JwtUser) {
    return this.contributions.getWallets(user.sub);
  }

  @Get('wallet/transactions')
  walletTransactions(
    @CurrentUser() user: JwtUser,
    @Query() query: ListWalletTransactionsQueryDto,
  ) {
    return this.contributions.listWalletTransactions(user.sub, query);
  }
}
