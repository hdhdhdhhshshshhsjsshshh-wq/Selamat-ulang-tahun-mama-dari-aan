/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface Note {
  pitch: number;   // Frequency in Hz
  duration: number; // Duration in beats
}

// Frequencies for G Major / C Major (Let's use C Major for a clear, sweet tone)
const C4 = 261.63;
const D4 = 293.66;
const E4 = 329.63;
const F4 = 349.23;
const Fs4 = 369.99;
const G4 = 392.00;
const A4 = 440.00;
const B4 = 493.88;
const C5 = 523.25;
const D5 = 587.33;
const E5 = 659.25;
const F5 = 698.46;
const G5 = 783.99;
const REST = 0;

// Happy Birthday To You notes & durations
const MELODY: Note[] = [
  { pitch: G4, duration: 0.75 },
  { pitch: G4, duration: 0.25 },
  { pitch: A4, duration: 1.0 },
  { pitch: G4, duration: 1.0 },
  { pitch: C5, duration: 1.0 },
  { pitch: B4, duration: 2.0 },
  
  { pitch: REST, duration: 0.2 }, // brief pause
  
  { pitch: G4, duration: 0.75 },
  { pitch: G4, duration: 0.25 },
  { pitch: A4, duration: 1.0 },
  { pitch: G4, duration: 1.0 },
  { pitch: D5, duration: 1.0 },
  { pitch: C5, duration: 2.0 },
  
  { pitch: REST, duration: 0.2 },
  
  { pitch: G4, duration: 0.75 },
  { pitch: G4, duration: 0.25 },
  { pitch: G5, duration: 1.0 },
  { pitch: E5, duration: 1.0 },
  { pitch: C5, duration: 1.0 },
  { pitch: B4, duration: 1.0 },
  { pitch: A4, duration: 2.0 },
  
  { pitch: REST, duration: 0.2 },
  
  { pitch: F5, duration: 0.75 },
  { pitch: F5, duration: 0.25 },
  { pitch: E5, duration: 1.0 },
  { pitch: C5, duration: 1.0 },
  { pitch: D5, duration: 1.0 },
  { pitch: C5, duration: 3.0 },
];

export class BirthdaySynthesizer {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private currentNoteIndex = 0;
  private nextNoteTime = 0;
  private timerId: number | null = null;
  private tempo = 120; // beats per minute
  private masterGain: GainNode | null = null;
  private activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];

  constructor() {
    // Lazy initialize to comply with browser restrictions
  }

  private initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.audioCtx.currentTime); // default volume 50%
      this.masterGain.connect(this.audioCtx.destination);
    }
    
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public start() {
    this.initAudio();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentNoteIndex = 0;
    this.nextNoteTime = this.audioCtx!.currentTime;
    this.scheduler();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    
    // Stop all active oscillators
    this.activeOscillators.forEach(({ osc }) => {
      try {
        osc.stop();
      } catch (e) {
        // ignore
      }
    });
    this.activeOscillators = [];
  }

  public setVolume(volume: number) {
    this.initAudio();
    if (this.masterGain && this.audioCtx) {
      // Smooth volume transition
      this.masterGain.gain.setTargetAtTime(volume, this.audioCtx.currentTime, 0.1);
    }
  }

  private scheduler() {
    if (!this.isPlaying || !this.audioCtx) return;

    const scheduleAheadTime = 0.1; // schedule 100ms in advance
    const secondsPerBeat = 60.0 / this.tempo;

    while (this.nextNoteTime < this.audioCtx.currentTime + scheduleAheadTime) {
      const note = MELODY[this.currentNoteIndex];
      if (note.pitch !== REST) {
        this.playTone(note.pitch, this.nextNoteTime, note.duration * secondsPerBeat);
      }
      
      this.nextNoteTime += note.duration * secondsPerBeat;
      this.currentNoteIndex = (this.currentNoteIndex + 1) % MELODY.length;
    }

    // Schedule next polling interval
    this.timerId = window.setTimeout(() => this.scheduler(), 50.0);
  }

  private playTone(frequency: number, startTime: number, duration: number) {
    if (!this.audioCtx || !this.masterGain) return;

    // Use a complex timbre to make it sound like a beautiful music box
    // Fundamental oscillator (triangle wave for warmth)
    const osc1 = this.audioCtx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(frequency, startTime);

    // Overtone oscillator (sine wave at 2x frequency for bell-like chime)
    const osc2 = this.audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 2, startTime);

    // Dynamic envelope for a beautiful pluck/chime
    const gainNode1 = this.audioCtx.createGain();
    const gainNode2 = this.audioCtx.createGain();

    // Pluck Envelope parameters
    const attack = 0.02;
    const decay = duration * 0.8;
    const release = 0.1;

    // Connect fundamental
    osc1.connect(gainNode1);
    gainNode1.connect(this.masterGain);

    // Connect overtone (quieter, adds shimmer)
    osc2.connect(gainNode2);
    gainNode2.connect(this.masterGain);

    // Fundamental volume envelope
    gainNode1.gain.setValueAtTime(0, startTime);
    gainNode1.gain.linearRampToValueAtTime(0.35, startTime + attack);
    gainNode1.gain.exponentialRampToValueAtTime(0.001, startTime + attack + decay);

    // Overtone volume envelope
    gainNode2.gain.setValueAtTime(0, startTime);
    gainNode2.gain.linearRampToValueAtTime(0.12, startTime + attack);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, startTime + attack + (decay * 0.5));

    // Start oscillators
    osc1.start(startTime);
    osc2.start(startTime);

    // Stop and cleanup
    const stopTime = startTime + duration + release;
    osc1.stop(stopTime);
    osc2.stop(stopTime);

    const activeItem1 = { osc: osc1, gain: gainNode1 };
    const activeItem2 = { osc: osc2, gain: gainNode2 };
    this.activeOscillators.push(activeItem1, activeItem2);

    // Remove from active list after playback ends
    setTimeout(() => {
      this.activeOscillators = this.activeOscillators.filter(item => item !== activeItem1 && item !== activeItem2);
    }, (stopTime - this.audioCtx!.currentTime) * 1000 + 500);
  }
}
