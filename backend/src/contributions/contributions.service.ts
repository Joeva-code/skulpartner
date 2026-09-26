import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { SettingsService } from '../settings/settings.service.js';
import type {
  CreateContributionDto,
  ListContributionsQueryDto,
  ListWalletTransactionsQueryDto,
} from './dtos.js';

/** Share of annual school fees a parent contributes upfront. */
const CONTRIBUTION_RATE = 0.7;
/** Insurance premium charged on top of the contribution. */
const INSURANCE_RATE = 0.015;
/** School fees are released to the school across three terms. */
const TERM_COUNT = 3;

const toNumber = (value: unknown): number => Number(value ?? 0);

const round2 = (value: number): number => Math.round(value * 100) / 100;

@Injectable()
export class ContributionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settings: SettingsService,
  ) {}

  /**
   * Quote for a beneficiary: what the parent pays now and what we hold.
   * Exposed separately so the UI can preview before committing.
   */
  async quote(beneficiaryId: string, userId: string, annualFees?: number) {
    const beneficiary = await this.prisma.beneficiary.findFirst({
      where: { id: beneficiaryId, userId },
    });

    if (!beneficiary) {
      throw new NotFoundException('Beneficiary not found');
    }

    const fees = annualFees ?? toNumber(beneficiary.annualFee);

    if (fees <= 0) {
      throw new BadRequestException(
        'Set your child annual school fees before contributing',
      );
    }

    const settings = await this.settings.get();
    const maintenanceFee = toNumber(settings?.maintenanceFee);
    const contributionAmount = round2(fees * CONTRIBUTION_RATE);
    const insuranceFee = round2(contributionAmount * INSURANCE_RATE);
    const totalUpfront = round2(
      contributionAmount + insuranceFee + maintenanceFee,
    );

    return {
      beneficiaryId: beneficiary.id,
      beneficiaryName: `${beneficiary.firstName} ${beneficiary.lastName}`,
      annualFees: round2(fees),
      contributionAmount,
      insuranceFee,
      maintenanceFee,
      totalUpfront,
      contributionRate: CONTRIBUTION_RATE,
      insuranceRate: INSURANCE_RATE,
      termFeeTarget: round2(fees / TERM_COUNT),
      termCount: TERM_COUNT,
      cyclePlan: this.cyclePlan(settings),
    };
  }

  /**
   * One term = one cycle. Lengths come from AppSettings so the schedule can be
   * tuned without a deploy, and the first school-fee release is due in cycle 1.
   */
  private cyclePlan(settings: Awaited<ReturnType<SettingsService['get']>>) {
    const days = [
      settings?.cycle1Days ?? 123,
      settings?.cycle2Days ?? 121,
      settings?.cycle3Days ?? 121,
    ].slice(0, TERM_COUNT);

    return days.map((cycleDays, index) => ({
      cycleNumber: index + 1,
      days: cycleDays,
    }));
  }

  /** Pricing constants + settings-derived fees, for the contribute form. */
  async getConfig() {
    const settings = await this.settings.get();

    return {
      contributionRate: CONTRIBUTION_RATE,
      insuranceRate: INSURANCE_RATE,
      termCount: TERM_COUNT,
      maintenanceFee: toNumber(settings?.maintenanceFee),
      cycles: [
        { cycleNumber: 1, days: settings?.cycle1Days ?? 123 },
        { cycleNumber: 2, days: settings?.cycle2Days ?? 121 },
        { cycleNumber: 3, days: settings?.cycle3Days ?? 121 },
      ],
    };
  }
  async list(userId: string, query: ListContributionsQueryDto) {
    const contributions = await this.prisma.contribution.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
      include: { cycles: { orderBy: { cycleNumber: 'asc' } } },
    });

    return contributions.map((c) => this.serialize(c));
  }

  async findOne(id: string, userId: string) {
    const contribution = await this.prisma.contribution.findFirst({
      where: { id, userId },
      include: { cycles: { orderBy: { cycleNumber: 'asc' } } },
    });

    if (!contribution) {
      throw new NotFoundException('Contribution not found');
    }

    return this.serialize(contribution);
  }

  /**
   * Dashboard aggregate: totals, progress toward the contribution target and
   * wallet balances. Drives both dashboard cards.
   */
  async getSummary(userId: string) {
    const [contributions, wallets] = await Promise.all([
      this.prisma.contribution.findMany({
        where: {
          userId,
          status: { in: ['ACTIVE', 'COMPLETED', 'PENDING_APPROVAL'] },
        },
      }),
      this.getWallets(userId),
    ]);

    const annualFees = contributions.reduce(
      (sum, c) => sum + toNumber(c.annualFees),
      0,
    );
    const contributed = contributions.reduce(
      (sum, c) => sum + toNumber(c.contributionAmount),
      0,
    );
    const feesPaid = contributions.reduce(
      (sum, c) => sum + toNumber(c.maintenanceFee) + toNumber(c.insuranceFee),
      0,
    );
    const totalPaid = contributions.reduce(
      (sum, c) => sum + toNumber(c.totalUpfront),
      0,
    );
    const schoolFeesReleased = contributions.reduce(
      (sum, c) => sum + toNumber(c.annualFees) * (1 - CONTRIBUTION_RATE),
      0,
    );

    return {
      count: contributions.length,
      activeCount: contributions.filter((c) => c.status === 'ACTIVE').length,
      annualFees: round2(annualFees),
      contributionTarget: round2(annualFees * CONTRIBUTION_RATE),
      contributed: round2(contributed),
      feesPaid: round2(feesPaid),
      totalPaid: round2(totalPaid),
      schoolFeesCovered: round2(schoolFeesReleased),
      progressPct:
        annualFees > 0
          ? Math.min(Math.round((contributed / annualFees) * 100), 100)
          : 0,
      wallets,
    };
  }
  /**
   * Create a contribution: quote the fees, open the term cycles and credit the
   * wallet. The whole thing runs in one transaction so a contribution can never
   * exist without its cycles or its wallet credit.
   */
  async create(userId: string, dto: CreateContributionDto) {
    const quote = await this.quote(dto.beneficiaryId, userId, dto.annualFees);
    const settings = await this.settings.get();
    const dailyGrowthRate = toNumber(settings?.dailyGrowthRateMin) || 0.008;

    return this.prisma.$transaction(async (tx) => {
      const contribution = await tx.contribution.create({
        data: {
          userId,
          status: 'ACTIVE',
          annualFees: quote.annualFees,
          contributionAmount: quote.contributionAmount,
          insuranceFee: quote.insuranceFee,
          maintenanceFee: quote.maintenanceFee,
          totalUpfront: quote.totalUpfront,
        },
      });

      // Chain the cycles end-to-end so each term starts the day the last ended.
      let cursor = new Date();

      for (const cycle of quote.cyclePlan) {
        const startDate = cursor;
        const endDate = new Date(
          startDate.getTime() + cycle.days * 24 * 60 * 60 * 1000,
        );
        cursor = endDate;

        await tx.cycle.create({
          data: {
            contributionId: contribution.id,
            cycleNumber: cycle.cycleNumber,
            startDate,
            endDate,
            days: cycle.days,
            dailyGrowthRate,
            termFeeTarget: round2(quote.annualFees / TERM_COUNT),
            status: cycle.cycleNumber === 1 ? 'ACTIVE' : 'UPCOMING',
          },
        });
      }

      // Only the contribution principal is held as a balance. Insurance and
      // maintenance are fees charged up front, so they are recorded as
      // debits without adding to what we owe back.
      const wallet = await tx.wallet.upsert({
        where: { userId_type: { userId, type: 'CONTRIBUTION' } },
        create: {
          userId,
          type: 'CONTRIBUTION',
          balance: quote.contributionAmount,
        },
        update: { balance: { increment: quote.contributionAmount } },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'CONTRIBUTION',
          amount: quote.contributionAmount,
          reference: `CONTRIB-${contribution.id}`,
          description: `Contribution for ${quote.beneficiaryName} (${dto.paymentMethod})`,
        },
      });

      if (quote.insuranceFee > 0) {
        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'INSURANCE',
            amount: -quote.insuranceFee,
            reference: `INSURANCE-${contribution.id}`,
            description: `Insurance fee (${quote.insuranceRate * 100}% of contribution)`,
          },
        });
      }

      if (quote.maintenanceFee > 0) {
        await tx.walletTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'MAINTENANCE',
            amount: -quote.maintenanceFee,
            reference: `MAINTENANCE-${contribution.id}`,
            description: 'One-off maintenance fee',
          },
        });
      }

      const created = await tx.contribution.findUniqueOrThrow({
        where: { id: contribution.id },
        include: { cycles: { orderBy: { cycleNumber: 'asc' } } },
      });

      return {
        ...this.serialize(created),
        beneficiaryId: quote.beneficiaryId,
        beneficiaryName: quote.beneficiaryName,
        paymentMethod: dto.paymentMethod,
      };
    });
  }

  /** Both wallets, created on demand so reads never 404 for a new user. */
  async getWallets(userId: string) {
    const types = ['CONTRIBUTION', 'SCHOOL'] as const;

    await Promise.all(
      types.map((type) =>
        this.prisma.wallet.upsert({
          where: { userId_type: { userId, type } },
          create: { userId, type },
          update: {},
        }),
      ),
    );

    const wallets = await this.prisma.wallet.findMany({
      where: { userId },
      orderBy: { type: 'asc' },
    });

    return wallets.map((wallet) => ({
      type: wallet.type,
      balance: round2(toNumber(wallet.balance)),
      updatedAt: wallet.updatedAt,
    }));
  }

  async listWalletTransactions(
    userId: string,
    query: ListWalletTransactionsQueryDto,
  ) {
    const wallets = await this.prisma.wallet.findMany({ where: { userId } });
    const walletIds = wallets.map((w) => w.id);

    if (walletIds.length === 0) {
      return [];
    }

    const transactions = await this.prisma.walletTransaction.findMany({
      where: { walletId: { in: walletIds } },
      orderBy: { createdAt: 'desc' },
      take: query.limit,
    });

    const walletTypeById = new Map(wallets.map((w) => [w.id, w.type] as const));

    return transactions.map((txn) => ({
      id: txn.id,
      walletType: walletTypeById.get(txn.walletId) ?? null,
      type: txn.type,
      amount: round2(toNumber(txn.amount)),
      reference: txn.reference,
      status: txn.status,
      description: txn.description,
      createdAt: txn.createdAt,
    }));
  }

  /** Decimal-safe view of a contribution plus its term-by-term schedule. */
  private serialize(contribution: {
    id: string;
    status: string;
    annualFees: unknown;
    contributionAmount: unknown;
    insuranceFee: unknown;
    maintenanceFee: unknown;
    totalUpfront: unknown;
    currentCycleNumber: number;
    createdAt: Date;
    updatedAt: Date;
    cycles: {
      id: string;
      cycleNumber: number;
      startDate: Date;
      endDate: Date;
      days: number;
      termFeeTarget: unknown;
      amountAchieved: unknown;
      growthEarned: unknown;
      netBalance: unknown;
      status: string;
    }[];
  }) {
    return {
      id: contribution.id,
      status: contribution.status,
      annualFees: round2(toNumber(contribution.annualFees)),
      contributionAmount: round2(toNumber(contribution.contributionAmount)),
      insuranceFee: round2(toNumber(contribution.insuranceFee)),
      maintenanceFee: round2(toNumber(contribution.maintenanceFee)),
      totalUpfront: round2(toNumber(contribution.totalUpfront)),
      currentCycleNumber: contribution.currentCycleNumber,
      createdAt: contribution.createdAt,
      updatedAt: contribution.updatedAt,
      cycles: contribution.cycles.map((cycle) => ({
        id: cycle.id,
        cycleNumber: cycle.cycleNumber,
        startDate: cycle.startDate,
        endDate: cycle.endDate,
        days: cycle.days,
        termFeeTarget: round2(toNumber(cycle.termFeeTarget)),
        amountAchieved: cycle.amountAchieved === null
          ? null
          : round2(toNumber(cycle.amountAchieved)),
        growthEarned: cycle.growthEarned === null
          ? null
          : round2(toNumber(cycle.growthEarned)),
        netBalance: cycle.netBalance === null
          ? null
          : round2(toNumber(cycle.netBalance)),
        status: cycle.status,
      })),
    };
  }
}
