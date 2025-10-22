import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Combat Session MongoDB Schema
 * Stored in noel-precision-archives database (Noel's domain!)
 */
@Schema({ timestamps: true })
export class CombatSession extends Document {
  @Prop({ required: true, unique: true })
  combatId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: 'noel' })
  commander: string;

  @Prop({ type: [String], default: ['neko-arc', 'mario-gallo-bestino'] })
  supportUnits: string[];

  @Prop({ type: Object })
  missionStructure: {
    phase1: string;
    phase2: string;
    phase3: string;
    phase4?: string;
    finale: string;
  };

  @Prop({ type: Object })
  environment: {
    hardware: string;
    software: string;
    encodingMethod: string;
    outputLocation: string;
  };

  @Prop({ type: Object })
  performanceMetrics: {
    encodingDurationMs: number;
    videoOutputSizeMb: number;
    encodingSpeed: string;
    subtitleLayers: number;
    personalityInteractions: number;
  };

  @Prop()
  noelAssessment: string;

  @Prop()
  nekoComment: string;

  @Prop()
  marioProtest: string;

  @Prop()
  noelRetort?: string;

  @Prop({ default: 'MISSION_IN_PROGRESS' })
  status: string; // MISSION_IN_PROGRESS, MISSION_COMPLETE, MISSION_FAILED

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const CombatSessionSchema = SchemaFactory.createForClass(CombatSession);
