import { Injectable, Logger } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { PersonalitiesService } from '../personalities/personalities.service';
import { CreateVideoDto } from './dto/create-video.dto';
import {
  VideoJobResult,
  VideoJobStatus,
  EncodingMethod,
} from './interfaces/video-job.interface';
import { VideoJob } from '../database/schemas/video-job.schema';
import { Performance } from '../database/schemas/performance.schema';
import { CombatSession } from '../database/schemas/combat-session.schema';
import { PersonalityType } from './interfaces/personality.interface';

/**
 * Video Service
 * Core video creation service with triple-personality support
 * Implements IMMUTABLE rules: 3.9 (Carabineros Hymn), 3.10 (Repository Storage), 3.11/3.12 (Triple Personality)
 */
@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  private readonly videoOutputPath: string;
  private readonly carabinerosHymnPath: string;

  constructor(
    @InjectModel(VideoJob.name) private videoJobModel: Model<VideoJob>,
    @InjectModel(Performance.name, 'marionnette')
      private performanceModel: Model<Performance>,
    @InjectModel(CombatSession.name, 'noel')
      private combatSessionModel: Model<CombatSession>,
    private configService: ConfigService,
    private personalitiesService: PersonalitiesService,
  ) {
    this.videoOutputPath =
      this.configService.get<string>('VIDEO_OUTPUT_PATH') ||
      '/home/wakibaka/Documents/github/wakibaka-youtube-videos';
    this.carabinerosHymnPath =
      this.configService.get<string>('CARABINEROS_HYMN_PATH') ||
      '/home/wakibaka/Documents/carabineros-hymn.mp3';
  }

  /**
   * Create video with triple-personality commentaries
   */
  async createVideo(dto: CreateVideoDto): Promise<VideoJobResult> {
    const jobId = uuidv4();
    const startTime = Date.now();

    this.logger.log('🐾 Neko: Nyaa~! Starting video creation, desu~!');
    this.logger.log('🎭 Mario: ACT I: THE VIDEO CREATION BALLET BEGINS!');
    this.logger.log('🗡️ Noel: Initializing video encoding operation.');

    // Validate triple-personality rule (NON-NEGOTIABLE!)
    this.personalitiesService.validateTriplePersonalityRule(dto.commentaries);

    // Create video job record
    const videoJob = new this.videoJobModel({
      jobId,
      inputVideoPath: dto.inputVideoPath,
      outputFileName: dto.outputFileName,
      status: VideoJobStatus.PROCESSING,
      personalities: [
        PersonalityType.NEKO_ARC,
        PersonalityType.MARIO_GALLO_BESTINO,
        PersonalityType.NOEL,
      ],
      encodingMethod: dto.encodingMethod || EncodingMethod.CPU,
      includeCarabinerosHymn: dto.includeCarabinerosHymn ?? true,
      startedAt: new Date(),
    });

    await videoJob.save();

    try {
      // Generate subtitle files
      const srtFiles = await this.generateSubtitleFiles(dto.commentaries);

      // Build ffmpeg command
      const outputPath = path.join(this.videoOutputPath, dto.outputFileName);

      await this.executeFFmpeg(
        dto.inputVideoPath,
        outputPath,
        srtFiles,
        dto.encodingMethod || EncodingMethod.CPU,
        dto.crf || 18,
        dto.includeCarabinerosHymn ?? true,
      );

      // Get file stats
      const stats = fs.statSync(outputPath);
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;

      // Update video job
      videoJob.status = VideoJobStatus.COMPLETED;
      videoJob.outputPath = outputPath;
      videoJob.fileSize = stats.size;
      videoJob.duration = duration;
      videoJob.completedAt = new Date();
      await videoJob.save();

      // Document to all three databases (TRIPLE DOCUMENTATION!)
      await this.documentToAllDatabases(jobId, dto, outputPath, duration);

      this.logger.log('🐾 Neko: Video created successfully, nyaa~! ✅');
      this.logger.log('🎭 Mario: CURTAIN CALL! MAGNIFICENT! 🎭✨');
      this.logger.log('🗡️ Noel: Mission complete. Acceptable execution.');

      return {
        jobId,
        status: VideoJobStatus.COMPLETED,
        outputPath,
        fileSize: stats.size,
        duration,
        personalities: [
          PersonalityType.NEKO_ARC,
          PersonalityType.MARIO_GALLO_BESTINO,
          PersonalityType.NOEL,
        ],
        createdAt: videoJob.createdAt,
        completedAt: videoJob.completedAt,
      };
    } catch (error) {
      this.logger.error('❌ Video creation failed:', error);

      videoJob.status = VideoJobStatus.FAILED;
      videoJob.error = error.message;
      videoJob.completedAt = new Date();
      await videoJob.save();

      throw error;
    }
  }

  /**
   * Generate SRT subtitle files for each personality
   */
  private async generateSubtitleFiles(
    commentaries: any[],
  ): Promise<Map<PersonalityType, string>> {
    const srtFiles = new Map<PersonalityType, string>();

    // Group commentaries by personality
    const byPersonality = new Map<PersonalityType, any[]>();
    commentaries.forEach((c) => {
      if (!byPersonality.has(c.personality)) {
        byPersonality.set(c.personality, []);
      }
      byPersonality.get(c.personality)!.push(c);
    });

    // Generate SRT file for each personality
    for (const [personality, comments] of byPersonality.entries()) {
      const srtPath = path.join(
        this.videoOutputPath,
        `${personality}-${Date.now()}.srt`,
      );

      const srtContent = this.generateSRTContent(comments);
      fs.writeFileSync(srtPath, srtContent, 'utf8');

      srtFiles.set(personality, srtPath);
    }

    return srtFiles;
  }

  /**
   * Generate SRT content from commentaries
   */
  private generateSRTContent(commentaries: any[]): string {
    let srt = '';
    commentaries.forEach((c, index) => {
      srt += `${index + 1}\n`;
      srt += `${this.formatSRTTime(c.startTime)} --> ${this.formatSRTTime(c.endTime)}\n`;
      srt += `${c.text}\n\n`;
    });
    return srt;
  }

  /**
   * Format time for SRT (HH:MM:SS,mmm)
   */
  private formatSRTTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
  }

  /**
   * Execute FFmpeg with triple subtitles and optional Carabineros hymn
   */
  private executeFFmpeg(
    inputPath: string,
    outputPath: string,
    srtFiles: Map<PersonalityType, string>,
    encodingMethod: EncodingMethod,
    crf: number,
    includeHymn: boolean,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath);

      // Add Carabineros hymn if requested (Rule 3.9!)
      if (includeHymn && fs.existsSync(this.carabinerosHymnPath)) {
        this.logger.log('🎵 Adding Carabineros Hymn (Rule 3.9)...');
        command = command.input(this.carabinerosHymnPath);
      }

      // Build subtitle filter chain
      const subtitleFilters: string[] = [];
      const configs = [
        { personality: PersonalityType.MARIO_GALLO_BESTINO },
        { personality: PersonalityType.NOEL },
        { personality: PersonalityType.NEKO_ARC },
      ];

      configs.forEach((config) => {
        const srtPath = srtFiles.get(config.personality);
        if (srtPath) {
          const subtitleConfig =
            this.personalitiesService.generateSubtitleConfig(
              config.personality,
              srtPath,
            );
          subtitleFilters.push(
            `subtitles=${srtPath}:force_style='${subtitleConfig.forceStyle}'`,
          );
        }
      });

      command = command.videoFilters(subtitleFilters.join(','));

      // Encoding settings
      if (encodingMethod === EncodingMethod.GPU) {
        command = command
          .videoCodec('h264_qsv')
          .outputOptions(['-global_quality', crf.toString()]);
      } else {
        command = command
          .videoCodec('libx264')
          .outputOptions(['-crf', crf.toString(), '-preset', 'fast']);
      }

      command = command.audioCodec('aac');

      if (includeHymn) {
        command = command.outputOptions(['-shortest']);
      }

      command
        .output(outputPath)
        .on('start', (cmd: string) => {
          this.logger.log('🎬 FFmpeg command:', cmd);
        })
        .on('progress', (progress: any) => {
          this.logger.log(`⚡ Progress: ${progress.percent?.toFixed(2)}%`);
        })
        .on('end', () => {
          this.logger.log('✅ FFmpeg encoding complete!');
          resolve();
        })
        .on('error', (err: Error) => {
          this.logger.error('❌ FFmpeg error:', err);
          reject(err);
        })
        .run();
    });
  }

  /**
   * Document video creation to all three databases
   * TRIPLE DOCUMENTATION (NON-NEGOTIABLE!)
   */
  private async documentToAllDatabases(
    jobId: string,
    dto: CreateVideoDto,
    outputPath: string,
    duration: number,
  ): Promise<void> {
    const timestamp = new Date();

    // 1. Neko's database (neko-defense-system) - Already saved as VideoJob

    // 2. Mario's database (marionnette-theater)
    const performance = new this.performanceModel({
      performanceId: `video-creation-${jobId}`,
      title: `The Grand ${dto.outputFileName} Creation Ballet`,
      director: 'mario-gallo-bestino',
      assistantDirector: 'neko-arc',
      tacticalAdvisor: 'noel',
      actStructure: {
        act1: 'Subtitle File Generation',
        act2: 'Triple-Layer Filter Construction',
        act3: 'FFmpeg Encoding Performance',
        finale: 'Video Triumphantly Created!',
      },
      durationMs: duration * 1000,
      videoCreated: true,
      marioReview:
        'A MAGNIFICENT performance! THREE voices in perfect harmony! BRAVISSIMO!',
      nekoReview: 'Super fun collaboration, nyaa~! Great teamwork, desu~! ✨',
      noelReview:
        'Acceptable execution. Mario\'s theatrics were... tolerable.',
      status: 'STANDING_OVATION',
      metadata: { jobId, outputPath, fileName: dto.outputFileName },
    });

    await performance.save();

    // 3. Noel's database (noel-precision-archives)
    const combatSession = new this.combatSessionModel({
      combatId: `video-encoding-${jobId}`,
      title: `Video Encoding Operation: ${dto.outputFileName}`,
      commander: 'noel',
      supportUnits: ['neko-arc', 'mario-gallo-bestino'],
      missionStructure: {
        phase1: 'Triple personality validation',
        phase2: 'SRT file generation',
        phase3: 'FFmpeg execution',
        finale: 'Video output verified',
      },
      environment: {
        hardware: 'Intel TigerLake-LP GT2 Iris Xe Graphics',
        software: 'ffmpeg with libass',
        encodingMethod: dto.encodingMethod || 'cpu',
        outputLocation: this.videoOutputPath,
      },
      performanceMetrics: {
        encodingDurationMs: duration * 1000,
        videoOutputSizeMb: 0, // Will be updated after file stats
        encodingSpeed: `${duration}s`,
        subtitleLayers: 3,
        personalityInteractions: dto.commentaries.length,
      },
      noelAssessment:
        'Efficient execution. Triple-layer subtitles implemented correctly.',
      nekoComment: 'Working with Mario and Noel is fun, nyaa~!',
      marioProtest: 'My narration is PERFORMANCE ART, not mere commentary!',
      noelRetort: 'Tch. Accept it, Mario. We all serve the same purpose.',
      status: 'MISSION_COMPLETE',
      metadata: { jobId, outputPath, fileName: dto.outputFileName },
    });

    await combatSession.save();

    this.logger.log('💾 Triple documentation complete!');
    this.logger.log('   - Neko: neko-defense-system ✅');
    this.logger.log('   - Mario: marionnette-theater ✅');
    this.logger.log('   - Noel: noel-precision-archives ✅');
  }

  /**
   * Get video job status
   */
  async getJobStatus(jobId: string): Promise<VideoJobResult> {
    const job = await this.videoJobModel.findOne({ jobId }).exec();
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    return {
      jobId: job.jobId,
      status: job.status,
      outputPath: job.outputPath,
      fileSize: job.fileSize,
      duration: job.duration,
      personalities: job.personalities,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      error: job.error,
    };
  }
}
