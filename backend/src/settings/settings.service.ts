import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const existing = await this.prisma.appSettings.findUnique({
      where: { id: 1 },
    });

    if (!existing) {
      await this.prisma.appSettings.create({ data: { id: 1 } });
    }
  }

  async get() {
    return this.prisma.appSettings.findUnique({ where: { id: 1 } });
  }
}