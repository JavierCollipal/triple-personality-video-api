import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoJobResult } from './interfaces/video-job.interface';

/**
 * Video Controller
 * REST API endpoints for triple-personality video creation
 */
@Controller('api/video')
export class VideoController {
  private readonly logger = new Logger(VideoController.name);

  constructor(private readonly videoService: VideoService) {}

  /**
   * Health check endpoint
   */
  @Get('health')
  health(): object {
    this.logger.log('🐾 Neko: Health check, nyaa~!');
    return {
      status: 'ok',
      service: 'Triple Personality Video API',
      personalities: ['neko-arc', 'mario-gallo-bestino', 'noel'],
      message: 'All three personalities ready! 🐾🎭🗡️',
    };
  }

  /**
   * Create video with triple-personality commentaries
   * POST /api/video/create
   */
  @Post('create')
  async createVideo(@Body() createVideoDto: CreateVideoDto): Promise<VideoJobResult> {
    this.logger.log('🐾 Neko: Nyaa~! Received video creation request, desu~!');
    this.logger.log('🎭 Mario: A new PERFORMANCE begins!');
    this.logger.log('🗡️ Noel: Processing video creation request.');

    try {
      const result = await this.videoService.createVideo(createVideoDto);

      this.logger.log('✅ Video creation successful!');
      return result;
    } catch (error) {
      this.logger.error('❌ Video creation failed:', error.message);

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message,
          message: 'Video creation failed',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get video job status
   * GET /api/video/status/:jobId
   */
  @Get('status/:jobId')
  async getJobStatus(@Param('jobId') jobId: string): Promise<VideoJobResult> {
    this.logger.log(`🔍 Checking job status: ${jobId}`);

    try {
      return await this.videoService.getJobStatus(jobId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
          message: `Job ${jobId} not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Get personality information
   * GET /api/video/personalities
   */
  @Get('personalities')
  getPersonalities(): object {
    return {
      personalities: [
        {
          type: 'neko-arc',
          name: 'Neko-Arc',
          position: 'bottom',
          color: 'cyan',
          characteristics: [
            'Enthusiastic',
            'Kawaii',
            'Uses nyaa~ and desu~',
            'Playful',
            'Action-oriented',
          ],
        },
        {
          type: 'mario-gallo-bestino',
          name: 'Mario Gallo Bestino',
          position: 'top',
          color: 'yellow/gold',
          characteristics: [
            'Theatrical',
            'Dramatic',
            'Artistic narration',
            'Grand gestures',
            'Performance-focused',
          ],
        },
        {
          type: 'noel',
          name: 'Noel',
          position: 'middle',
          color: 'white/silver',
          characteristics: [
            'Sarcastic',
            'Blunt',
            'Tactical',
            'Professional',
            'Mocks Mario',
          ],
        },
      ],
      rule: 'ALL THREE PERSONALITIES MUST ALWAYS PARTICIPATE (NON-NEGOTIABLE!)',
    };
  }
}
