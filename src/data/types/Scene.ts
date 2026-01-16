import type { Track } from './Track';

export interface Scene {
  id: string;
  name: string;
  image: string;
  gradient: string;
  tracks: Track[];
}
