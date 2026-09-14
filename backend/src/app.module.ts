import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { SettingsModule } from './settings/settings.module.js';
import { OnboardingModule } from './onboarding/onboarding.module.js';

@Module({
  imports: [PrismaModule, AuthModule, SettingsModule, OnboardingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}