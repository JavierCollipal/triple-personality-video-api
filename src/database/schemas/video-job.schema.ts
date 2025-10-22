import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PersonalityType } from '../../video/interfaces/personality.interface';
import {
  VideoJobStatus,
  EncodingMethod,
} from '../../video/interfaces/video-job.interface';

/**
 * Video Job MongoDB Schema
 * Stored in neko-defense-system database
 */
@Schema({ timestamps: true })
export class VideoJob extends Document {
  @Prop({ required: true, unique: true })
  jobId: string;

  @Prop({ required: true })
  inputVideoPath: string;

  @Prop({ required: true })
  outputFileName: string;

  @Prop({ type: String, enum: VideoJobStatus, default: VideoJobStatus.PENDING })
  status: VideoJobStatus;

  @Prop()
  outputPath?: string;

  @Prop()
  fileSize?: number;

  @Prop()
  duration?: number;

  @Prop({ type: [String], enum: PersonalityType, required: true })
  personalities: PersonalityType[];

  @Prop({ type: String, enum: EncodingMethod, default: EncodingMethod.CPU })
  encodingMethod: EncodingMethod;

  @Prop({ default: true })
  includeCarabinerosHymn: boolean;

  @Prop()
  error?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  startedAt?: Date;

  @Prop()
  completedAt?: Date;

  // Timestamps added automatically by Mongoose
  createdAt: Date;
  updatedAt: Date;
}

export const VideoJobSchema = SchemaFactory.createForClass(VideoJob);
