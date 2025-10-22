import { PersonalityType, Commentary } from './personality.interface';

/**
 * Video encoding method
 */
export enum EncodingMethod {
  CPU = 'cpu',
  GPU = 'gpu',
}

/**
 * Video job status
 */
export enum VideoJobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Video creation request
 */
export interface VideoCreationRequest {
  inputVideoPath: string;
  outputFileName: string;
  commentaries: Commentary[];
  encodingMethod?: EncodingMethod;
  includeCarabinerosHymn?: boolean;
  crf?: number; // Quality (18 recommended)
}

/**
 * Video job result
 */
export interface VideoJobResult {
  jobId: string;
  status: VideoJobStatus;
  outputPath?: string;
  fileSize?: number;
  duration?: number;
  error?: string;
  personalities: PersonalityType[];
  createdAt: Date;
  completedAt?: Date;
}

/**
 * FFmpeg encoding options
 */
export interface FFmpegOptions {
  crf: number;
  preset: string;
  encodingMethod: EncodingMethod;
  audioCodec: string;
  videoCodec: string;
}
