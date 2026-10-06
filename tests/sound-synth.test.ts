import { describe, it, expect, beforeEach } from 'vitest';
import { soundSynth } from '../lib/audio/sound-synth';

describe('Sound Synthesizer', () => {
  beforeEach(() => {
    soundSynth.setMuted(false);
  });

  it('toggles mute state correctly', () => {
    expect(soundSynth.isMuted()).toBe(false);
    const muted = soundSynth.toggleMute();
    expect(muted).toBe(true);
    expect(soundSynth.isMuted()).toBe(true);
  });

  it('allows explicit mute setting', () => {
    soundSynth.setMuted(true);
    expect(soundSynth.isMuted()).toBe(true);
    soundSynth.setMuted(false);
    expect(soundSynth.isMuted()).toBe(false);
  });
});
