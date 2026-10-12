# Саундтрек для промо Phonics4All: до мажор, ~100 BPM, пад + дзвіночки + легкий біт, ефекти в тій самій тональності.
import numpy as np, wave

SR = 44100
DUR = 22.0
N = int(SR * DUR)
BEAT = 0.6
rng = np.random.default_rng(7)

def hz(m): return 440 * 2 ** ((m - 69) / 12)
def env(n, a, r):
    e = np.ones(n); ai = int(a * SR); ri = int(r * SR)
    if ai: e[:ai] = np.linspace(0, 1, ai)
    if ri: e[-ri:] *= np.linspace(1, 0, ri)
    return e
def add(buf, sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    sig = sig[: N - i]
    l, r = np.sqrt(0.5 * (1 - pan)), np.sqrt(0.5 * (1 + pan))
    buf[0, i:i + len(sig)] += sig * gain * l
    buf[1, i:i + len(sig)] += sig * gain * r
def lowpass(x, k):
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc += k * (v - acc); y[i] = acc
    return y

music = np.zeros((2, N)); sfx = np.zeros((2, N))

# Акорди: C – Am – F – G, по 4 долі
CH = [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]]
BASS = [36, 33, 41, 43]
bar = 4 * BEAT
t = 0.0; k = 0
while t < DUR:
    n = int(bar * SR) + int(0.4 * SR); tt = np.arange(n) / SR
    pad = sum(np.sin(2 * np.pi * hz(m) * tt + 0.3 * np.sin(2 * np.pi * 0.7 * tt)) for m in CH[k % 4]) / 4
    pad += 0.25 * sum(np.sin(2 * np.pi * hz(m) * 2.001 * tt) for m in CH[k % 4]) / 4
    add(music, pad * env(n, 0.35, 0.5), t, 0.16)
    b = np.sin(2 * np.pi * hz(BASS[k % 4]) * tt) * np.exp(-tt * 1.5)
    if t >= 3.2: add(music, b * env(n, 0.01, 0.3), t, 0.22)
    t += bar; k += 1

# Дзвіночки: мелодія з пентатоніки по восьмих
mel = [72, 76, 79, 76, 81, 79, 76, 74, 72, 74, 76, 79, 77, 76, 74, 79]
def bell(m, d=0.9):
    n = int(d * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * hz(m) * tt) + 0.35 * np.sin(2 * np.pi * hz(m) * 2.76 * tt) * np.exp(-tt * 9)) * np.exp(-tt * 4.5)
for j in range(int(DUR / (BEAT / 2))):
    tj = j * BEAT / 2
    if tj < 0.0 or tj > 21.0: continue
    if tj < 3.2 and j % 2: continue        # у гачку рідше
    add(music, bell(mel[j % 16]), tj, 0.07, pan=0.3 if j % 2 else -0.3)

# Біт: бочка на 1 і 3, клеп на 2 і 4, з 3.2 с
def kick():
    n = int(0.35 * SR); tt = np.arange(n) / SR
    f = 120 * np.exp(-tt * 18) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
def clap():
    n = int(0.18 * SR); tt = np.arange(n) / SR
    return lowpass(rng.standard_normal(n), 0.35) * np.exp(-tt * 28)
for j in range(int(DUR / BEAT)):
    tj = j * BEAT
    if 3.2 <= tj < 21.0:
        if j % 2 == 0: add(music, kick(), tj, 0.32)
        else: add(music, clap(), tj, 0.10)
        add(music, lowpass(rng.standard_normal(int(0.04 * SR)), 0.8) * np.exp(-np.arange(int(0.04 * SR)) / SR * 90), tj + BEAT / 2, 0.025)

# Ефекти: «поп» нотами акорду, дзвін злиття, м'які «вжухи»
def popnote(m):
    n = int(0.22 * SR); tt = np.arange(n) / SR
    f = hz(m) * (1 + 0.6 * np.exp(-tt * 40))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 22)
pops = [(0.05, 72), (0.17, 76), (0.29, 79), (0.55, 67), (0.87, 72), (1.19, 76), (1.55, 64),
        (3.7, 72), (8.35, 76), (8.85, 79), (9.3, 72), (13.2, 72), (13.55, 76), (13.9, 79),
        (15.75, 72), (16.2, 76), (16.65, 79), (19.8, 84), (20.1, 79)]
for tp, m in pops: add(sfx, popnote(m), tp, 0.18, pan=rng.uniform(-.3, .3))
for i, m in enumerate([72, 76, 79, 84]): add(sfx, bell(m, 1.4), 9.75 + i * 0.07, 0.12)
for i, m in enumerate([79, 84, 88]): add(sfx, bell(m, 1.6), 20.25 + i * 0.09, 0.08)
def whoosh(d=0.5):
    n = int(d * SR); tt = np.arange(n) / SR
    e = np.sin(np.pi * tt / d) ** 2
    return lowpass(rng.standard_normal(n), 0.08) * e
for tw in [3.0, 7.0, 11.6, 15.4, 18.4]: add(sfx, whoosh(), tw, 0.35)

mix = music + sfx
mix[:, -int(1.0 * SR):] *= np.linspace(1, 0, int(1.0 * SR))
mix[:, :int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / np.max(np.abs(mix))
pcm = (mix.T * 32767).astype(np.int16)
with wave.open('music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', pcm.shape)
