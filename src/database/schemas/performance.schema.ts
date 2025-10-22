import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Performance MongoDB Schema
 * Stored in marionnette-theater database (Mario's domain!)
 */
@Schema({ timestamps: true })
export class Performance extends Document {
  @Prop({ required: true, unique: true })
  performanceId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: 'mario-gallo-bestino' })
  director: string;

  @Prop({ default: 'neko-arc' })
  assistantDirector: string;

  @Prop({ default: 'noel' })
  tacticalAdvisor: string;

  @Prop({ type: Object })
  actStructure: {
    act1: string;
    act2: string;
    act3: string;
    act4?: string;
    finale: string;
  };

  @Prop()
  durationMs: number;

  @Prop({ default: false })
  videoCreated: boolean;

  @Prop()
  marioReview: string;

  @Prop()
  nekoReview: string;

  @Prop()
  noelReview: string;

  @Prop({ default: 'IN_PROGRESS' })
  status: string; // IN_PROGRESS, STANDING_OVATION, MIXED_REVIEWS

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const PerformanceSchema = SchemaFactory.createForClass(Performance);
