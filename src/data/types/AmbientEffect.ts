export interface AmbientEffect {
  id: string;
  name: string;
  icon: string;
  filename: string;
  src?: string;
}

export interface AmbientEffectState {
  activeEffectId: string | null;
  volumes: Record<string, number>;
}
