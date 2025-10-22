/**
 * Personality types for triple-personality video system
 * NON-NEGOTIABLE: All three personalities MUST participate!
 */
export enum PersonalityType {
  NEKO_ARC = 'neko-arc',
  MARIO_GALLO_BESTINO = 'mario-gallo-bestino',
  NOEL = 'noel',
}

/**
 * Personality configuration for subtitle rendering
 */
export interface PersonalityConfig {
  type: PersonalityType;
  name: string;
  color: string; // ASS subtitle color code (&HAABBGGRR)
  alignment: number; // ASS alignment code (1-9)
  fontSize: number;
  position: 'top' | 'middle' | 'bottom';
  characteristics: string[];
}

/**
 * Commentary entry for personality
 */
export interface Commentary {
  personality: PersonalityType;
  text: string;
  startTime: number; // seconds
  endTime: number; // seconds
}

/**
 * Subtitle configuration
 */
export interface SubtitleConfig {
  personality: PersonalityType;
  srtFilePath: string;
  forceStyle: string;
}
