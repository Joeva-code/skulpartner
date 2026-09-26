import { IsIn, IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateContributionDto {
  @IsString()
  @IsNotEmpty()
  beneficiaryId: string;

  /**
   * Overrides the beneficiary's stored annual school fees.
   * Falls back to the beneficiary's annualFee when omitted.
   */
  @IsInt({ message: 'annualFees must be an integer (kobo/naira)' })
  @Min(1, { message: 'annualFees must be greater than 0' })
  annualFees?: number;

  /** How the parent is funding the contribution. */
  @IsIn(['CARD', 'TRANSFER', 'USSD'])
  paymentMethod: 'CARD' | 'TRANSFER' | 'USSD' = 'TRANSFER';
}

export class ListContributionsQueryDto {
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}

export class ListWalletTransactionsQueryDto {
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}
