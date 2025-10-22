import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PersonalityType } from '../interfaces/personality.interface';
import { EncodingMethod } from '../interfaces/video-job.interface';

/**
 * Commentary DTO
 */
export class CommentaryDto {
  @IsEnum(PersonalityType)
  personality: PersonalityType;

  @IsString()
  text: string;

  @IsNumber()
  @Min(0)
  startTime: number;

  @IsNumber()
  @Min(0)
  endTime: number;
}

/**
 * Create Video DTO
 * Validation for video creation requests
 */
export class CreateVideoDto {
  @IsString()
  inputVideoPath: string;

  @IsString()
  outputFileName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommentaryDto)
  @ArrayMinSize(3, {
    message: 'ALL THREE PERSONALITIES MUST COMMENT! (NON-NEGOTIABLE Rule 3.11/3.12)',
  })
  commentaries: CommentaryDto[];

  @IsOptional()
  @IsEnum(EncodingMethod)
  encodingMethod?: EncodingMethod = EncodingMethod.CPU;

  @IsOptional()
  @IsBoolean()
  includeCarabinerosHymn?: boolean = true; // Rule 3.9: MANDATORY!

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(51)
  crf?: number = 18; // High quality default
}
