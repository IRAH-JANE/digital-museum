/**
 * Ambient rooms.
 *
 * No audio files ship with this project, and none are fetched: each room is
 * synthesised in the browser with the Web Audio API from filtered noise and a
 * few soft tones. That keeps the museum silent-by-default, offline-capable and
 * free of licensing questions, and it means every "track" is endless.
 *
 * `useAudio` reads these definitions. `drone` and `sparkle` are optional.
 */
export const ambienceTracks = [
  {
    id: 'quiet-gallery',
    name: 'Quiet gallery',
    description: 'Room tone, distant footsteps, air handling',
    noise: { type: 'brown', cutoff: 620, gain: 0.05 },
    drone: { notes: [110, 164.81], gain: 0.012 },
    sparkle: { interval: [7000, 16000], notes: [880, 1046.5], gain: 0.02, decay: 1.6 },
  },
  {
    id: 'soft-piano',
    name: 'Soft piano',
    description: 'Single notes, a long way off',
    noise: { type: 'brown', cutoff: 400, gain: 0.025 },
    drone: { notes: [130.81, 196], gain: 0.016 },
    sparkle: { interval: [2600, 6200], notes: [261.63, 329.63, 392, 493.88, 587.33], gain: 0.05, decay: 3.2 },
  },
  {
    id: 'rain-outside',
    name: 'Rain outside',
    description: 'Weather against tall windows',
    noise: { type: 'pink', cutoff: 1800, gain: 0.075 },
    drone: { notes: [87.31], gain: 0.01 },
    sparkle: null,
  },
  {
    id: 'classical-room',
    name: 'Classical room',
    description: 'Stone, marble, a long reverb tail',
    noise: { type: 'brown', cutoff: 520, gain: 0.035 },
    drone: { notes: [146.83, 220, 293.66], gain: 0.018 },
    sparkle: { interval: [5000, 11000], notes: [440, 587.33, 659.25], gain: 0.03, decay: 4 },
  },
  {
    id: 'night-museum',
    name: 'Night museum',
    description: 'After closing, lights down',
    noise: { type: 'brown', cutoff: 280, gain: 0.05 },
    drone: { notes: [65.41, 98], gain: 0.022 },
    sparkle: { interval: [9000, 20000], notes: [196, 233.08], gain: 0.025, decay: 5 },
  },
]

export const ambienceById = Object.fromEntries(ambienceTracks.map((t) => [t.id, t]))
