export type ScreenTab = 
  | 'games-hub'
  | 'guess-my-number'
  | 'card-duel'
  | 'race-to-100'
  | 'two-player-lobby'
  | 'guide';

export type AgeTier = 'all' | 'young' | 'mid' | 'upper';
export type SupplyType = 'all' | 'none' | 'cards' | 'dice';

export interface CharacterAvatar {
  id: string;
  name: string;
  emoji: string;
  color: string;
  tagline: string;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  team: string;
  streak: number;
  score: number;
}
