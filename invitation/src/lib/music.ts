// A music-box lullaby played with the Web Audio API: Brahms' Lullaby
// ("Wiegenlied", 1868, public domain), synthesised in the browser, so there's
// no audio file to download or license. Browsers only allow sound after the
// visitor taps something, so it starts from a tap (the envelope seal or the
// music button) and never on page load.

import { EVENT } from "@/config"

const BEAT = 0.72 // seconds per quarter note: a gentle lullaby pace

// MIDI note numbers. The melody sits an octave up, where a music box sings.
const n = (name: string) => {
  const m = name.match(/^([A-G])(#?)(\d)$/)!
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1] as "C"]
  return 12 * (Number(m[3]) + 1) + base + (m[2] ? 1 : 0)
}

// [note, beats]: the familiar tune in C, with a one-beat pickup.
const MELODY: [string, number][] = [
  ["E5", 0.5], ["E5", 0.5],
  ["G5", 1.5], ["E5", 0.5], ["E5", 1],
  ["G5", 2], ["E5", 0.5], ["G5", 0.5],
  ["C6", 1], ["B5", 1.5], ["A5", 0.5],
  ["A5", 1], ["G5", 1], ["D5", 0.5], ["E5", 0.5],
  ["F5", 1], ["D5", 1], ["D5", 0.5], ["E5", 0.5],
  ["F5", 2], ["D5", 0.5], ["F5", 0.5],
  ["B5", 0.5], ["A5", 0.5], ["G5", 1], ["B5", 1],
  ["C6", 2], ["C5", 0.5], ["C5", 0.5],
  ["C6", 2], ["A5", 0.5], ["F5", 0.5],
  ["G5", 2], ["E5", 0.5], ["C5", 0.5],
  ["F5", 1], ["G5", 1], ["A5", 1],
  ["G5", 2], ["C5", 0.5], ["C5", 0.5],
  ["C6", 2], ["A5", 0.5], ["F5", 0.5],
  ["G5", 2], ["E5", 0.5], ["C5", 0.5],
  ["F5", 1], ["E5", 1], ["D5", 1],
  ["C5", 2], // + the pickup of the next time round
]

// One chord per bar (after the pickup): root, then two soft waltz notes.
const BARS: [string, string, string][] = [
  ["C3", "G3", "E4"], ["C3", "G3", "E4"], ["F2", "C4", "A3"], ["G2", "D4", "B3"],
  ["G2", "F3", "B3"], ["G2", "F3", "B3"], ["G2", "F3", "D4"], ["C3", "G3", "E4"],
  ["F2", "C4", "A3"], ["C3", "G3", "E4"], ["F2", "C4", "A3"], ["C3", "G3", "E4"],
  ["F2", "C4", "A3"], ["C3", "G3", "E4"], ["G2", "F3", "B3"], ["C3", "G3", "E4"],
]
// 48 beats: the last bar is finished by the next pass's pickup.
const LOOP_BEATS = MELODY.reduce((t, [, b]) => t + b, 0)

type Note = { at: number; midi: number; level: number; bell: boolean }

/** Every note of one pass, timed in beats from the start of the pass. */
function score(): Note[] {
  const notes: Note[] = []
  let t = 0
  for (const [name, beats] of MELODY) {
    notes.push({ at: t, midi: n(name), level: 0.55, bell: true })
    t += beats
  }
  BARS.forEach(([root, a, b], i) => {
    const bar = 1 + i * 3 // after the one-beat pickup
    notes.push({ at: bar, midi: n(root), level: 0.32, bell: false })
    notes.push({ at: bar + 1, midi: n(a), level: 0.16, bell: false })
    notes.push({ at: bar + 2, midi: n(b), level: 0.16, bell: false })
  })
  return notes.sort((x, y) => x.at - y.at)
}
const SCORE = score()

/** A plucked music-box tine: a bright attack that rings away. */
function pluck(ctx: BaseAudioContext, out: AudioNode, when: number, midi: number, level: number, bell: boolean) {
  const f = 440 * 2 ** ((midi - 69) / 12)
  const ring = bell ? 1.8 : 1.4
  const env = ctx.createGain()
  env.gain.setValueAtTime(0, when)
  env.gain.linearRampToValueAtTime(level, when + 0.005)
  env.gain.exponentialRampToValueAtTime(0.0008, when + ring)
  env.connect(out)
  // fundamental, a soft octave and a faint metallic partial
  const partials: [number, number, OscillatorType][] = bell
    ? [[1, 1, "sine"], [2, 0.22, "sine"], [5.4, 0.05, "sine"]]
    : [[1, 1, "sine"], [2, 0.12, "triangle"]]
  for (const [mult, gain, type] of partials) {
    const osc = ctx.createOscillator()
    osc.type = type
    osc.frequency.value = f * mult
    const g = ctx.createGain()
    g.gain.value = gain
    osc.connect(g).connect(env)
    osc.start(when)
    osc.stop(when + ring + 0.05)
  }
}

/** A small, soft room so the notes bloom a little. */
function room(ctx: BaseAudioContext) {
  const len = Math.floor(ctx.sampleRate * 2.2)
  const ir = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3
  }
  const conv = ctx.createConvolver()
  conv.buffer = ir
  return conv
}

/** Wires the music box into a context; returns where notes should go. */
export function musicBoxOutput(ctx: BaseAudioContext) {
  const master = ctx.createGain()
  master.gain.value = 0.32
  master.connect(ctx.destination)
  const dry = ctx.createGain()
  dry.gain.value = 0.8
  dry.connect(master)
  const wet = ctx.createGain()
  wet.gain.value = 0.35
  const verb = room(ctx)
  verb.connect(wet).connect(master)
  const input = ctx.createGain()
  input.connect(dry)
  input.connect(verb)
  return { input, master }
}

/** Schedules one pass of the tune starting at `start` (seconds). */
export function schedulePass(ctx: BaseAudioContext, out: AudioNode, start: number, from = 0, until = Infinity) {
  for (const note of SCORE) {
    const when = start + note.at * BEAT
    if (when < from || when >= until) continue
    pluck(ctx, out, when, note.midi, note.level, note.bell)
  }
}

export const PASS_SECONDS = LOOP_BEATS * BEAT

// ---------------------------------------------------------------------------
// The page's one player.

type Listener = (playing: boolean) => void
const PREF_KEY = `${EVENT.id}.music`

class MusicBox {
  private ctx: AudioContext | null = null
  private out: AudioNode | null = null
  private master: GainNode | null = null
  private timer: number | null = null
  private passStart = 0
  private scheduledUntil = 0
  private listeners = new Set<Listener>()
  playing = false

  get supported() {
    return typeof window !== "undefined" && ("AudioContext" in window || "webkitAudioContext" in window)
  }

  /** The visitor turned the music off before: don't start it for them again. */
  get mutedByVisitor() {
    try {
      return localStorage.getItem(PREF_KEY) === "off"
    } catch {
      return false
    }
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn)
    return () => void this.listeners.delete(fn)
  }

  private emit() {
    for (const fn of this.listeners) fn(this.playing)
  }

  private remember(on: boolean) {
    try {
      localStorage.setItem(PREF_KEY, on ? "on" : "off")
    } catch {
      // storage unavailable: just don't remember
    }
  }

  /** Must be called from a tap or click. */
  async play() {
    if (!this.supported || this.playing) return
    if (!this.ctx) {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new Ctx()
      const { input, master } = musicBoxOutput(this.ctx)
      this.out = input
      this.master = master
      this.passStart = this.ctx.currentTime + 0.15
      this.scheduledUntil = this.passStart
    }
    await this.ctx.resume()
    // fade in
    const now = this.ctx.currentTime
    this.master!.gain.cancelScheduledValues(now)
    this.master!.gain.setValueAtTime(0.0001, now)
    this.master!.gain.exponentialRampToValueAtTime(0.32, now + 1.2)
    this.playing = true
    this.remember(true)
    this.tick()
    this.timer = window.setInterval(() => this.tick(), 250)
    this.emit()
  }

  pause() {
    if (!this.ctx || !this.playing) return
    const ctx = this.ctx
    const now = ctx.currentTime
    this.master!.gain.cancelScheduledValues(now)
    this.master!.gain.setValueAtTime(this.master!.gain.value, now)
    this.master!.gain.exponentialRampToValueAtTime(0.0001, now + 0.4)
    window.setTimeout(() => {
      if (!this.playing) void ctx.suspend()
    }, 450)
    if (this.timer) window.clearInterval(this.timer)
    this.timer = null
    this.playing = false
    this.remember(false)
    this.emit()
  }

  toggle() {
    if (this.playing) this.pause()
    else void this.play()
  }

  /** Keeps about a second of notes scheduled ahead, pass after pass. */
  private tick() {
    const ctx = this.ctx!
    const horizon = ctx.currentTime + 1.2
    while (this.scheduledUntil < horizon) {
      const end = Math.min(horizon, this.passStart + PASS_SECONDS)
      schedulePass(ctx, this.out!, this.passStart, this.scheduledUntil, end)
      this.scheduledUntil = end
      if (end >= this.passStart + PASS_SECONDS) this.passStart += PASS_SECONDS
    }
  }
}

export const musicBox = new MusicBox()
