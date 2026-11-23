export type WelcomeStage =
  | 'DIVINE_INTRO'        // Scene 1: Dark burgundy, golden rotating mandala, Ganesh motif with glowing aura, diyas lighting up
  | 'ENVELOPE_REVEAL'     // Scene 2: 3D Maroon envelope with gold borders and golden wax seal (A & N monogram)
  | 'UNSEALED_CARD'       // Scene 3 & 4: Flap opens, ivory card slides out, couple typography appears, "OPEN WEDDING INVITATION" button
  | 'CINEMATIC_TRANSITION'; // Scene 5: Royal palace doors open outward, golden light flood, smooth dissolve to hero

export interface WelcomeExperienceProps {
  onComplete: () => void;
  onSkip?: () => void;
  autoPlayAudio?: boolean;
}
