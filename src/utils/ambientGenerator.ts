// Ambient sound generator using Web Audio API
// Creates relaxing drone sounds without needing external audio files

type PresetKey = 'day' | 'sunset' | 'night';

interface PresetConfig {
  name: string;
  baseFreq: number;
  harmonics: number[];
  volumes: number[];
  filterFreq: number;
  lfoRate: number;
}

interface OscillatorEntry {
  osc: OscillatorNode;
  gain: GainNode;
}

interface AmbientState {
  isPlaying: boolean;
  preset: PresetKey | null;
  presetName: string | null;
}

class AmbientGenerator {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private oscillators: OscillatorEntry[] = [];
  private _isPlaying = false;
  private currentPreset: PresetKey | null = null;

  static presets: Record<PresetKey, PresetConfig> = {
    day: {
      name: 'Morning Calm',
      baseFreq: 220,
      harmonics: [1, 1.5, 2, 2.5],
      volumes: [0.15, 0.08, 0.05, 0.03],
      filterFreq: 800,
      lfoRate: 0.1,
    },
    sunset: {
      name: 'Golden Hour',
      baseFreq: 174.61,
      harmonics: [1, 1.25, 1.5, 2],
      volumes: [0.12, 0.1, 0.06, 0.04],
      filterFreq: 600,
      lfoRate: 0.08,
    },
    night: {
      name: 'Deep Sleep',
      baseFreq: 110,
      harmonics: [1, 1.5, 2, 3],
      volumes: [0.18, 0.06, 0.04, 0.02],
      filterFreq: 400,
      lfoRate: 0.05,
    },
  };

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  init(): this {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0;
    }
    return this;
  }

  private createOscillators(preset: PresetKey): void {
    const config = AmbientGenerator.presets[preset];
    if (!config || !this.audioContext || !this.gainNode) return;

    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = config.filterFreq;
    filter.Q.value = 1;
    filter.connect(this.gainNode);

    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.value = config.lfoRate;
    lfoGain.gain.value = 10;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.oscillators.push({ osc: lfo, gain: lfoGain });

    config.harmonics.forEach((harmonic, index) => {
      const osc = this.audioContext!.createOscillator();
      const oscGain = this.audioContext!.createGain();

      osc.type = index === 0 ? 'sine' : 'triangle';
      osc.frequency.value = config.baseFreq * harmonic;
      osc.detune.value = (Math.random() - 0.5) * 10;

      oscGain.gain.value = config.volumes[index] ?? 0.05;
      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start();
      this.oscillators.push({ osc, gain: oscGain });
    });

    this.currentPreset = preset;
  }

  play(preset: PresetKey = 'day'): void {
    if (!this.audioContext) this.init();
    if (!this.audioContext || !this.gainNode) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (this.currentPreset !== preset) {
      this.stop();
      this.createOscillators(preset);
    }

    this.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
    this.gainNode.gain.setValueAtTime(
      this.gainNode.gain.value,
      this.audioContext.currentTime
    );
    this.gainNode.gain.linearRampToValueAtTime(
      1,
      this.audioContext.currentTime + 2
    );

    this._isPlaying = true;
  }

  pause(): void {
    if (!this.audioContext || !this.gainNode) return;

    this.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
    this.gainNode.gain.setValueAtTime(
      this.gainNode.gain.value,
      this.audioContext.currentTime
    );
    this.gainNode.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + 0.5
    );

    this._isPlaying = false;
  }

  stop(): void {
    this.pause();

    this.oscillators.forEach(({ osc }) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Oscillator may already be stopped
      }
    });
    this.oscillators = [];
    this.currentPreset = null;
  }

  changePreset(preset: PresetKey): void {
    const wasPlaying = this._isPlaying;
    this.stop();
    if (wasPlaying) {
      this.play(preset);
    }
  }

  getState(): AmbientState {
    return {
      isPlaying: this._isPlaying,
      preset: this.currentPreset,
      presetName: this.currentPreset
        ? AmbientGenerator.presets[this.currentPreset]?.name
        : null,
    };
  }
}

const ambientGenerator = new AmbientGenerator();

export default ambientGenerator;
export { AmbientGenerator };
export type { PresetKey, PresetConfig, AmbientState };
