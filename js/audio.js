/**
 * audio.js — Procedural sound effects via Web Audio API.
 *
 * No audio files. All sounds are synthesized from oscillators
 * with soft attack/release envelopes for zero clicks/pops.
 * AudioContext is created lazily on the first user interaction.
 * Master volume is kept low (~0.15).
 *
 * Exports:
 *   initAudio()                → call on first user click
 *   play(name)                 → 'click' | 'tick' | 'chime' | 'open' | 'close'
 *   setEnabled(bool)           → mute/unmute
 *   isEnabled()                → boolean
 */

let ctx = null;        // AudioContext
let master = null;     // GainNode (master volume)
let enabled = false;   // sound on/off
const MASTER_VOL = 0.15;

/**
 * Lazily create the AudioContext (must be called from a user gesture).
 */
export function initAudio() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = MASTER_VOL;
    master.connect(ctx.destination);
    enabled = true;
  }
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

/**
 * Enable or disable all sound output.
 */
export function setEnabled(val) {
  enabled = !!val;
  if (master && ctx) {
    master.gain.setTargetAtTime(enabled ? MASTER_VOL : 0, ctx.currentTime, 0.015);
  }
}

/**
 * Is sound currently enabled?
 */
export function isEnabled() {
  return enabled;
}

/* ---- Sound definitions ---- */

/**
 * Soft click — short warm sine blip with 3ms attack.
 */
function playClick() {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(640, t);
  osc.frequency.exponentialRampToValueAtTime(420, t + 0.045);
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.55, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
  osc.connect(gain);
  gain.connect(master);
  osc.start(t);
  osc.stop(t + 0.07);
}

/**
 * Gentle tick — subtle console ping when moving between nodes.
 */
function playTick() {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1480, t);
  osc.frequency.exponentialRampToValueAtTime(840, t + 0.032);
  gain.gain.setValueAtTime(0.001, t);
  gain.gain.linearRampToValueAtTime(0.28, t + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.042);
  osc.connect(gain);
  gain.connect(master);
  osc.start(t);
  osc.stop(t + 0.045);
}

/**
 * Soft success chime — ascending triad (C5 → E5 → G5).
 */
function playChime() {
  const freqs = [523.25, 659.25, 783.99];
  freqs.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.08;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.42, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.72);
  });
}

/**
 * Soft rising interval when opening a detail/info overlay.
 */
function playOpen() {
  const freqs = [440, 587.33]; // A4 → D5
  freqs.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.055;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.25);
  });
}

/**
 * Soft descending interval when closing an overlay.
 */
function playClose() {
  const freqs = [523.25, 392.0]; // C5 → G4
  freqs.forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.05;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.24, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(master);
    osc.start(t);
    osc.stop(t + 0.21);
  });
}

/** Registry of named sounds */
const sounds = {
  click: playClick,
  tick: playTick,
  chime: playChime,
  open: playOpen,
  close: playClose,
};

/**
 * Play a named sound. No-op if audio is disabled or not initialized.
 * @param {'click'|'tick'|'chime'|'open'|'close'} name
 */
export function play(name) {
  if (!ctx || !enabled) return;
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  const fn = sounds[name];
  if (fn) fn();
}
