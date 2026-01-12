// Ambient sound generator using Web Audio API
// Creates relaxing drone sounds without needing external audio files

class AmbientGenerator {
  constructor() {
    this.audioContext = null;
    this.gainNode = null;
    this.oscillators = [];
    this.isPlaying = false;
    this.currentPreset = null;
  }

  // Initialize audio context (must be called after user interaction)
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = 0;
    }
    return this;
  }

  // Preset configurations for different scenes
  static presets = {
    day: {
      name: 'Morning Calm',
      baseFreq: 220,
      harmonics: [1, 1.5, 2, 2.5],
      volumes: [0.15, 0.08, 0.05, 0.03],
      filterFreq: 800,
      lfoRate: 0.1
    },
    sunset: {
      name: 'Golden Hour',
      baseFreq: 174.61,
      harmonics: [1, 1.25, 1.5, 2],
      volumes: [0.12, 0.1, 0.06, 0.04],
      filterFreq: 600,
      lfoRate: 0.08
    },
    night: {
      name: 'Deep Sleep',
      baseFreq: 110,
      harmonics: [1, 1.5, 2, 3],
      volumes: [0.18, 0.06, 0.04, 0.02],
      filterFreq: 400,
      lfoRate: 0.05
    }
  };

  // Create oscillators for ambient sound
  createOscillators(preset) {
    const config = AmbientGenerator.presets[preset];
    if (!config || !this.audioContext) return;

    // Create filter for warmth
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = config.filterFreq;
    filter.Q.value = 1;
    filter.connect(this.gainNode);

    // Create LFO for subtle movement
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.value = config.lfoRate;
    lfoGain.gain.value = 10;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.oscillators.push({ osc: lfo, gain: lfoGain });

    // Create harmonic oscillators
    config.harmonics.forEach((harmonic, index) => {
      const osc = this.audioContext.createOscillator();
      const oscGain = this.audioContext.createGain();

      osc.type = index === 0 ? 'sine' : 'triangle';
      osc.frequency.value = config.baseFreq * harmonic;

      // Slight detuning for richness
      osc.detune.value = (Math.random() - 0.5) * 10;

      oscGain.gain.value = config.volumes[index] || 0.05;
      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start();
      this.oscillators.push({ osc, gain: oscGain });
    });

    this.currentPreset = preset;
  }

  // Start playing
  play(preset = 'day') {
    if (!this.audioContext) this.init();

    // Resume context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // If different preset, stop and recreate
    if (this.currentPreset !== preset) {
      this.stop();
      this.createOscillators(preset);
    }

    // Fade in
    this.gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
    this.gainNode.gain.setValueAtTime(
      this.gainNode.gain.value,
      this.audioContext.currentTime
    );
    this.gainNode.gain.linearRampToValueAtTime(
      1,
      this.audioContext.currentTime + 2
    );

    this.isPlaying = true;
  }

  // Pause (fade out but keep oscillators)
  pause() {
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

    this.isPlaying = false;
  }

  // Stop completely
  stop() {
    this.pause();

    // Stop and disconnect all oscillators
    this.oscillators.forEach(({ osc }) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator may already be stopped
      }
    });
    this.oscillators = [];
    this.currentPreset = null;
  }

  // Change to a different preset
  changePreset(preset) {
    const wasPlaying = this.isPlaying;
    this.stop();
    if (wasPlaying) {
      this.play(preset);
    }
  }

  // Get current state
  getState() {
    return {
      isPlaying: this.isPlaying,
      preset: this.currentPreset,
      presetName: this.currentPreset
        ? AmbientGenerator.presets[this.currentPreset]?.name
        : null
    };
  }
}

// Singleton instance
const ambientGenerator = new AmbientGenerator();

export default ambientGenerator;
export { AmbientGenerator };
