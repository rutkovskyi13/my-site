# Кліпи «живої Lulu» для вправ Practice (див. brand/lulu-video/README.md).
# Усі кліпи згенеровані з brand/lulu-video/start-frame.png на зеленому фоні.
# Запуск: для кожного кліпу ffmpeg -i <відео> <папка>/<назва>/f/%03d.png, потім
#   python3 tools/lulu-clips.py <папка> <куди класти mp4/webm/постер>
# Результат: lulu-<назва>.mp4 і .webm у форматі stacked alpha (колір зверху, смуга, маска знизу)
# та lulu-live-poster.webp (стартова поза з прозорістю). Складає їх site/src/components/LuluLive.jsx.
import sys, glob, os, subprocess, tempfile, numpy as np, cv2
from importlib import util
spec = util.spec_from_file_location('gk', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lulu-greenkey.py'))
gk = util.module_from_spec(spec); spec.loader.exec_module(gk)

SRC, DST = sys.argv[1], sys.argv[2]
X0, Y0, X1, Y1 = 476, 60, 1444, 1000          # спільна рамка: Lulu однакова й на тому самому місці в усіх кліпах
H = 480
W = round((X1 - X0) * H / (Y1 - Y0) / 2) * 2
GAP = 16
CREAM = np.array([0xF2, 0xF9, 0xFF], np.float32)

# Як збираємо кожен кліп з кадрів вихідного відео.
#   pingpong: вперед від a до b, потім назад до a — кліп закінчується там, де почався
#   speed: у скільки разів швидше за оригінал
CLIPS = {
    'idle':   dict(a=0,  b=191, pingpong=True,  speed=1.0),   # чекає: кліпає, дивиться на дитину (по колу)
    'listen': dict(a=48, b=168, pingpong=False, speed=1.5),   # прислухається: нахил голови й повернення до стартової пози
    'cheer':  dict(a=6,  b=100, pingpong=True,  speed=1.25),  # радіє: піднімає книжку й махає, потім повертається
}

def keyed(path):
    c, a = gk.key(cv2.imread(path)[Y0:Y1, X0:X1])
    a = cv2.erode(a, np.ones((3, 3), np.uint8), iterations=3)   # зрізаємо сірий обідок від зеленого фону
    a = cv2.GaussianBlur(a, (5, 5), 0)
    col = np.where(a[..., None] > 0.004, c, CREAM)
    col = cv2.resize(col.clip(0, 255), (W, H), interpolation=cv2.INTER_AREA)
    return col, cv2.resize(a, (W, H), interpolation=cv2.INTER_AREA)

def stacked(col, a):
    fr = np.zeros((H * 2 + GAP, W, 3), np.float32)
    fr[:H] = col
    fr[H + GAP:] = (a * 255)[..., None]
    return fr.clip(0, 255).astype(np.uint8)

os.makedirs(DST, exist_ok=True)
for name, c in CLIPS.items():
    fs = sorted(glob.glob(f'{SRC}/{name}/f/*.png'))
    idx = list(range(c['a'], c['b'] + 1))
    if c['pingpong']:
        idx += idx[-2:0:-1]
    n = max(2, round(len(idx) / c['speed']))
    idx = [idx[min(len(idx) - 1, round(i * c['speed']))] for i in range(n)]
    cache = {}
    with tempfile.TemporaryDirectory() as tmp:
        for j, i in enumerate(idx):
            if i not in cache:
                cache[i] = stacked(*keyed(fs[i]))
            cv2.imwrite(f'{tmp}/{j:04d}.png', cache[i])
        if name == 'idle':
            col, a = keyed(fs[0])
            cv2.imwrite(f'{tmp}/poster.png', np.dstack([col, a * 255]).clip(0, 255).astype(np.uint8))
            subprocess.run(['python3', '-c', f"from PIL import Image; Image.open('{tmp}/poster.png').save('{DST}/lulu-live-poster.webp', quality=85)"], check=True)
        inp = ['ffmpeg', '-v', 'error', '-y', '-framerate', '24', '-i', f'{tmp}/%04d.png', '-an', '-pix_fmt', 'yuv420p']
        subprocess.run(inp + ['-c:v', 'libx264', '-crf', '21', '-preset', 'slow', '-movflags', '+faststart', f'{DST}/lulu-{name}.mp4'], check=True)
        subprocess.run(inp + ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '32', '-row-mt', '1', f'{DST}/lulu-{name}.webm'], check=True)
    print(name, 'frames', n, f'{n / 24:.1f}s', 'size', W, H * 2 + GAP)
