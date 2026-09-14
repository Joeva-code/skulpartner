import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus() {
    const userCount = await this.prisma.user.count();

    return {
      message: 'SKULPARTNERS backend is connected to Neon',
      userCount,
    };
  }
}