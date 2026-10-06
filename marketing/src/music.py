"""Synthesise the story's background track: an original music-box tune.

    python3 music.py out.wav [seconds]

Everything is generated here (no samples), so the track is free to use.
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 126
BEAT = 60 / BPM

NOTES = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def freq(name):
    return 440 * 2 ** ((NOTES[name[0]] + 12 * (int(name[-1]) + 1) - 69) / 12)


def music_box(f, dur):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 3.2) * np.minimum(1, t / 0.003)
    tone = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6)
            + 0.12 * np.sin(2 * np.pi * 4.16 * f * t) * np.exp(-t * 14))
    return tone * env


def bass(f, dur):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 4) * np.minimum(1, t / 0.008)
    return (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)) * env


def pluck(f, dur):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 9) * np.minimum(1, t / 0.004)
    return (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 20)) * env


def chime(f, dur):
    t = np.arange(int(SR * dur)) / SR
    env = np.exp(-t * 2.2) * np.minimum(1, t / 0.002)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2.76 * f * t) * np.exp(-t * 5)) * env


PHRASE_A = [
    [("E5", .5), ("G5", .5), ("C6", 1), ("B5", .5), ("G5", .5), ("E5", 1)],
    [("A5", .5), ("C6", .5), ("E6", 1), ("D6", .5), ("C6", .5), ("A5", 1)],
    [("F5", .5), ("A5", .5), ("C6", .5), ("A5", .5), ("G5", .5), ("F5", .5), ("E5", 1)],
    [("D5", .5), ("G5", .5), ("B5", .5), ("D6", .5), ("C6", .5), ("B5", .5), ("G5", 1)],
]
PHRASE_B = [
    [("C6", .5), ("E6", .5), ("G6", 1), ("E6", .5), ("C6", .5), ("G5", 1)],
    [("A5", .5), ("B5", .5), ("C6", .5), ("E6", .5), ("D6", 1), ("C6", 1)],
    [("A5", .5), ("C6", .5), ("F6", 1), ("E6", .5), ("D6", .5), ("C6", 1)],
    [("B5", .5), ("D6", .5), ("G6", .5), ("F6", .5), ("D6", 1), ("B5", 1)],
]
ENDING = [[("E5", .5), ("G5", .5), ("C6", .5), ("E6", .5), ("G6", 2)]]
CHORDS = {"C": ["C", "E", "G"], "Am": ["A", "C", "E"], "F": ["F", "A", "C"], "G": ["G", "B", "D"]}
PROG = ["C", "Am", "F", "G"]


def render(seconds):
    n = int(SR * (seconds + 3))
    L, R = np.zeros(n), np.zeros(n)

    def add(sig, start, gain, pan):
        i = int(start * SR)
        j = min(n, i + len(sig))
        L[i:j] += sig[: j - i] * gain * (1 - pan)
        R[i:j] += sig[: j - i] * gain * (1 + pan)

    bars = PHRASE_A + PHRASE_B + PHRASE_A + ENDING
    for b, bar in enumerate(bars):
        t0 = b * 4 * BEAT
        chord = "C" if b == len(bars) - 1 else PROG[b % 4]
        root = CHORDS[chord][0]
        # melody
        t = t0
        for note, beats in bar:
            add(music_box(freq(note), 2.0), t, 0.32, 0.25)
            t += beats * BEAT
        if b == len(bars) - 1:
            for k, nm in enumerate(["C3", "G3", "C4", "E4", "G4"]):
                add(bass(freq(nm), 3.0) if k < 2 else pluck(freq(nm), 2.5), t0 + k * .06, 0.22, -.1)
            continue
        # bass on beats 1 and 3
        add(bass(freq(root + "3"), 1.2), t0, 0.42, -.1)
        add(bass(freq(CHORDS[chord][2] + ("3" if chord != "F" else "2")), 1.2), t0 + 2 * BEAT, 0.32, -.1)
        # soft chord plucks on the off-beats
        for beat in (0.5, 1.5, 2.5, 3.5):
            for k, nm in enumerate(CHORDS[chord]):
                add(pluck(freq(nm + "4"), .6), t0 + beat * BEAT + k * .012, 0.09, -.35)
        # little shaker on eighths
        for e in range(8):
            noise = np.random.default_rng(b * 8 + e).standard_normal(int(.05 * SR))
            noise = np.diff(noise, prepend=0) * np.exp(-np.arange(len(noise)) / SR * 90)
            add(noise, t0 + e * .5 * BEAT, 0.018 if e % 2 else 0.01, .3)
        # sparkle chime at the start of each phrase
        if b % 4 == 0:
            for k, nm in enumerate(["C7", "G6", "E7"]):
                add(chime(freq(nm), 2.5), t0 + k * .09, 0.07, .5)

    # simple stereo reverb: a few feedback-free echoes with slight damping
    for d, g in [(.083, .22), (.127, .18), (.191, .14), (.263, .11), (.347, .08)]:
        k = int(d * SR)
        L[k:] += np.convolve(R[:-k], [.5, .5], "same") * g
        R[k:] += np.convolve(L[:-k], [.5, .5], "same") * g

    out = np.stack([L, R], 1)[: int(SR * seconds)]
    fade = int(SR * 1.2)
    out[-fade:] *= np.linspace(1, 0, fade)[:, None] ** 2
    out[: int(SR * .02)] *= np.linspace(0, 1, int(SR * .02))[:, None]
    out *= 0.85 / np.abs(out).max()
    return out


if __name__ == "__main__":
    path = sys.argv[1]
    seconds = float(sys.argv[2]) if len(sys.argv) > 2 else 25
    data = (render(seconds) * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
