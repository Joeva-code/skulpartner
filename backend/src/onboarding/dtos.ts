import {
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class KycDto {
  @IsOptional()
  @IsString()
  bvn?: string;

  @IsOptional()
  @IsString()
  nin?: string;

  @IsOptional()
  @IsString()
  idType?: string;

  @IsOptional()
  @IsString()
  idNumber?: string;

  @IsOptional()
  @IsString()
  idDocumentUrl?: string;

  @IsOptional()
  @IsString()
  utilityBillUrl?: string;
}

export class CreateBeneficiaryDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsISO8601()
  dob?: string;

  @IsOptional()
  @IsString()
  schoolId?: string;

  @IsOptional()
  @IsString()
  schoolName?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsNumber()
  @Min(0)
  annualFee: number;
}

export class NextOfKinDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  relationship: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  bankAccountName?: string;

  @IsOptional()
  @IsString()
  bankAccountNumber?: string;
}

export class ConsentDto {
  @IsString()
  @IsNotEmpty()
  termsVersion: string;

  @IsString()
  @IsNotEmpty()
  privacyVersion: string;
}

export class SchoolSearchDto {
  @IsOptional()
  @IsString()
  search?: string;
}

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
