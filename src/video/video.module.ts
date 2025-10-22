import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { PersonalitiesModule } from '../personalities/personalities.module';
import { VideoJob, VideoJobSchema } from '../database/schemas/video-job.schema';
import { Performance, PerformanceSchema } from '../database/schemas/performance.schema';
import { CombatSession, CombatSessionSchema } from '../database/schemas/combat-session.schema';

/**
 * Video Module
 * Main module for video creation functionality
 */
@Module({
  imports: [
    ConfigModule,
    PersonalitiesModule,

    // Neko's database (neko-defense-system)
    MongooseModule.forFeature([{ name: VideoJob.name, schema: VideoJobSchema }]),

    // Mario's database (marionnette-theater)
    MongooseModule.forFeature(
      [{ name: Performance.name, schema: PerformanceSchema }],
      'marionnette',
    ),

    // Noel's database (noel-precision-archives)
    MongooseModule.forFeature([{ name: CombatSession.name, schema: CombatSessionSchema }], 'noel'),
  ],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
