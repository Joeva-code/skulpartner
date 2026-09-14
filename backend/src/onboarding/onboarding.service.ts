import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import {
  ConsentDto,
  CreateBeneficiaryDto,
  KycDto,
  NextOfKinDto,
} from './dtos.js';

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(userId: string) {
    const [user, kyc, nextOfKin, beneficiaries, consent] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.kycSubmission.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.nextOfKin.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.beneficiary.findMany({ where: { userId } }),
      this.prisma.consentLog.findFirst({
        where: { userId },
        orderBy: { consentedAt: 'desc' },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      phone: user.phone,
      kyc: kyc
        ? {
            id: kyc.id,
            status: kyc.status,
            submittedAt: kyc.submittedAt,
          }
        : null,
      beneficiaryCount: beneficiaries.length,
      hasNextOfKin: nextOfKin !== null,
      hasConsent: consent !== null,
    };
  }

  async getKyc(userId: string) {
    return this.prisma.kycSubmission.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsertKyc(userId: string, data: KycDto) {
    const existing = await this.prisma.kycSubmission.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      return this.prisma.kycSubmission.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.kycSubmission.create({
      data: { userId, ...data },
    });
  }

  async submitKyc(userId: string) {
    const existing = await this.prisma.kycSubmission.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!existing) {
      throw new BadRequestException('Complete your KYC details first');
    }

    return this.prisma.kycSubmission.update({
      where: { id: existing.id },
      data: { status: 'PENDING', submittedAt: new Date() },
    });
  }

  async searchSchools(search?: string) {
    return this.prisma.school.findMany({
      where: search
        ? { name: { contains: search, mode: 'insensitive' } }
        : undefined,
      orderBy: { name: 'asc' },
      take: 20,
    });
  }

  async ensureSchool(name: string) {
    const clean = name.trim();

    if (!clean) {
      throw new BadRequestException('School name is required');
    }

    const existing = await this.prisma.school.findFirst({
      where: { name: { equals: clean, mode: 'insensitive' } },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.school.create({ data: { name: clean } });
  }

  async createBeneficiary(userId: string, data: CreateBeneficiaryDto) {
    let schoolId = data.schoolId;

    if (!schoolId && data.schoolName) {
      const school = await this.ensureSchool(data.schoolName);
      schoolId = school.id;
    }

    return this.prisma.beneficiary.create({
      data: {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob ? new Date(data.dob) : null,
        schoolId,
        grade: data.grade,
        annualFee: data.annualFee,
      },
    });
  }

  async listBeneficiaries(userId: string) {
    return this.prisma.beneficiary.findMany({
      where: { userId },
      include: { school: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getNextOfKin(userId: string) {
    return this.prisma.nextOfKin.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsertNextOfKin(userId: string, data: NextOfKinDto) {
    const existing = await this.prisma.nextOfKin.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      return this.prisma.nextOfKin.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.nextOfKin.create({
      data: { userId, ...data },
    });
  }

  async consent(userId: string, dto: ConsentDto) {
    return this.prisma.consentLog.create({
      data: {
        userId,
        termsVersion: dto.termsVersion,
        privacyVersion: dto.privacyVersion,
      },
    });
  }
}