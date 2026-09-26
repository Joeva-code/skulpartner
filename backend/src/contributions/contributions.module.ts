import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module.js';
import { ContributionsController } from './contributions.controller.js';
import { ContributionsService } from './contributions.service.js';

@Module({
  imports: [SettingsModule],
  controllers: [ContributionsController],
  providers: [ContributionsService],
  exports: [ContributionsService],
})
export class ContributionsModule {}
