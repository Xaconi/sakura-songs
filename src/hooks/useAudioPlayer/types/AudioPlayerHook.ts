import type { AudioPlayerState } from './AudioPlayerState';
import type { AudioPlayerActions } from './AudioPlayerActions';

export type AudioPlayerHook = AudioPlayerState & AudioPlayerActions;
