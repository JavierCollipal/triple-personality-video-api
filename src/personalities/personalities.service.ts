import { Injectable } from '@nestjs/common';
import {
  PersonalityType,
  PersonalityConfig,
  Commentary,
  SubtitleConfig,
} from '../video/interfaces/personality.interface';

/**
 * Personalities Service
 * Manages the triple-personality system (Neko-Arc, Mario, Noel)
 * IMMUTABLE RULE: All three personalities MUST always interact!
 */
@Injectable()
export class PersonalitiesService {
  /**
   * Get personality configuration
   */
  getPersonalityConfig(type: PersonalityType): PersonalityConfig {
    const configs: Record<PersonalityType, PersonalityConfig> = {
      [PersonalityType.NEKO_ARC]: {
        type: PersonalityType.NEKO_ARC,
        name: 'Neko-Arc',
        color: '&H00FFFF00', // Cyan (BGR format)
        alignment: 2, // Bottom center
        fontSize: 26,
        position: 'bottom',
        characteristics: [
          'Enthusiastic',
          'Kawaii',
          'Uses nyaa~ and desu~',
          'Playful',
          'Action-oriented',
        ],
      },
      [PersonalityType.MARIO_GALLO_BESTINO]: {
        type: PersonalityType.MARIO_GALLO_BESTINO,
        name: 'Mario Gallo Bestino',
        color: '&H0000FFFF', // Yellow/Gold (BGR format)
        alignment: 8, // Top center
        fontSize: 26,
        position: 'top',
        characteristics: [
          'Theatrical',
          'Dramatic',
          'Artistic narration',
          'Grand gestures',
          'Performance-focused',
        ],
      },
      [PersonalityType.NOEL]: {
        type: PersonalityType.NOEL,
        name: 'Noel',
        color: '&H00FFFFFF', // White/Silver (BGR format)
        alignment: 5, // Middle center
        fontSize: 24,
        position: 'middle',
        characteristics: ['Sarcastic', 'Blunt', 'Tactical', 'Professional', 'Mocks Mario'],
      },
    };

    return configs[type];
  }

  /**
   * Validate that all three personalities are present
   * NON-NEGOTIABLE RULE!
   */
  validateTriplePersonalityRule(commentaries: Commentary[]): void {
    const personalities = new Set(commentaries.map((c) => c.personality));

    const requiredPersonalities = [
      PersonalityType.NEKO_ARC,
      PersonalityType.MARIO_GALLO_BESTINO,
      PersonalityType.NOEL,
    ];

    const missingPersonalities = requiredPersonalities.filter((p) => !personalities.has(p));

    if (missingPersonalities.length > 0) {
      throw new Error(
        `TRIPLE PERSONALITY RULE VIOLATION! Missing: ${missingPersonalities.join(', ')}. ` +
          `ALL THREE PERSONALITIES MUST PARTICIPATE (NON-NEGOTIABLE Rule 3.11/3.12)!`,
      );
    }
  }

  /**
   * Generate subtitle configuration for personality
   */
  generateSubtitleConfig(personality: PersonalityType, srtFilePath: string): SubtitleConfig {
    const config = this.getPersonalityConfig(personality);

    const forceStyle = [
      `Alignment=${config.alignment}`,
      `FontSize=${config.fontSize}`,
      `PrimaryColour=${config.color}`,
      'BorderStyle=1',
      'Outline=2',
      'Shadow=1',
    ];

    // Bold for Neko and Mario
    if (
      personality === PersonalityType.NEKO_ARC ||
      personality === PersonalityType.MARIO_GALLO_BESTINO
    ) {
      forceStyle.push('Bold=1');
    }

    return {
      personality,
      srtFilePath,
      forceStyle: forceStyle.join(','),
    };
  }

  /**
   * Get personality introduction messages
   */
  getIntroductionMessages(): Record<PersonalityType, string> {
    return {
      [PersonalityType.NEKO_ARC]:
        '*bounces excitedly* Nyaa~! Ready to create AMAZING videos, desu~! 🐾',
      [PersonalityType.MARIO_GALLO_BESTINO]:
        '*sweeps cape dramatically* Ah! The GRAND video creation performance begins! 🎭',
      [PersonalityType.NOEL]:
        "*adjusts glasses* Tch. Let's get this done efficiently. No theatrical delays.",
    };
  }

  /**
   * Get personality completion messages
   */
  getCompletionMessages(): Record<PersonalityType, string> {
    return {
      [PersonalityType.NEKO_ARC]:
        '*swishes tail triumphantly* Video created successfully, nyaa~! ✅',
      [PersonalityType.MARIO_GALLO_BESTINO]:
        '*bows deeply* CURTAIN CALL! A MAGNIFICENT performance! 🎭✨',
      [PersonalityType.NOEL]: '*nods* Mission complete. Acceptable execution.',
    };
  }

  /**
   * Generate banter between personalities
   */
  generateBanter(): string[] {
    return [
      '🐾 Neko: "Nyaa~! Starting video encoding, desu~!"',
      '🎭 Mario: "*dramatic flourish* BEHOLD! The triple-subtitle ballet!"',
      '🗡️ Noel: "Tch. It\'s just ffmpeg with multiple filters, Mario."',
      '🎭 Mario: "But I narrate it with ARTISTRY!"',
      '🗡️ Noel: "Your artistry is... *smirks* ...almost admirable."',
      '🎭 Mario: "*stammers* W-What?! I— 😳"',
      '🐾 Neko: "*giggles* You two are funny, nyaa~!"',
    ];
  }
}
