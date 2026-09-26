import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateContributionDto {
  @IsString()
  @IsNotEmpty()
  beneficiaryId: string;

  /**
   * Overrides the beneficiary's stored annual school fees.
   * Falls back to the beneficiary's annualFee when omitted.
   *
   * @IsOptional() is required here: class-validator's skipMissingProperties
   * defaults to false, so @Min/@IsInt would otherwise reject an absent value.
   */
  @IsOptional()
  @IsInt({ message: 'annualFees must be an integer (kobo/naira)' })
  @Min(1, { message: 'annualFees must be greater than 0' })
  annualFees?: number;

  /** How the parent is funding the contribution. */
  @IsIn(['CARD', 'TRANSFER', 'USSD'])
  paymentMethod: 'CARD' | 'TRANSFER' | 'USSD' = 'TRANSFER';
}

export class ListContributionsQueryDto {
  /**
   * @Type(() => Number) is required: query params arrive as strings, and the
   * global ValidationPipe sets `transform: true` but not
   * `enableImplicitConversion`, so @IsInt() would otherwise reject "?limit=20".
   */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}

export class ListWalletTransactionsQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}
