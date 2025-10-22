import { Module } from '@nestjs/common';
import { PersonalitiesService } from './personalities.service';

/**
 * Personalities Module
 * Manages the triple-personality system
 */
@Module({
  providers: [PersonalitiesService],
  exports: [PersonalitiesService],
})
export class PersonalitiesModule {}
