# Відео «Lulu складає CAT» для першого екрана Practice: прозорий фон і повтор без стику.
# Запуск: ffmpeg -i відео.mp4 <папка>/f/%03d.png; python3 tools/lulu-cat-render.py <папка>
# Результат: <папка>/out/NNN.png — кадр «колір зверху, маска прозорості знизу» (stacked alpha),
# <папка>/poster.png — перший кадр з прозорістю. Кодування й підключення: див. docs/handoff.md.
import sys, glob, os, numpy as np, cv2
from importlib import util
spec = util.spec_from_file_location('gk', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lulu-greenkey.py'))
gk = util.module_from_spec(spec); spec.loader.exec_module(gk)

S = sys.argv[1]
fs = sorted(glob.glob(S + '/f/*.png'))
A, B, K = 4, 183, 8        # кадри 4 і 183 майже однакові: повтор A..B, останні K кадрів плавно переходять у початок
X0, Y0, X1, Y1 = 440, 16, 1480, 1080
H = 640
W = round((X1 - X0) * H / (Y1 - Y0) / 2) * 2
GAP = 16                    # смуга між кольором і маскою, щоб стиснення не змішувало їх
CREAM = np.array([0xF2, 0xF9, 0xFF], np.float32)

def keyed(i):
    c, a = gk.key(cv2.imread(fs[i])[Y0:Y1, X0:X1])
    a = cv2.erode(a, np.ones((3, 3), np.uint8), iterations=3)   # зрізаємо сірий обідок від зеленого фону
    a = cv2.GaussianBlur(a, (5, 5), 0)
    return c * a[..., None], a                                   # колір, домножений на прозорість

os.makedirs(S + '/out', exist_ok=True)
for j in range(B - A):
    s = A + K + j
    pc, a = keyed(s)
    if s >= B:                                                   # хвіст змішуємо з відповідним кадром початку
        w = (s - B + 1) / (K + 1)
        pc2, a2 = keyed(s - (B - A))
        pc, a = pc * (1 - w) + pc2 * w, a * (1 - w) + a2 * w
    col = np.where(a[..., None] > 0.004, pc / np.maximum(a[..., None], 0.004), CREAM)
    col = cv2.resize(col.clip(0, 255), (W, H), interpolation=cv2.INTER_AREA)
    al = cv2.resize(a, (W, H), interpolation=cv2.INTER_AREA)
    frame = np.zeros((H * 2 + GAP, W, 3), np.float32)
    frame[:H] = col
    frame[H + GAP:] = (al * 255)[..., None]
    cv2.imwrite(f'{S}/out/{j:03d}.png', frame.clip(0, 255).astype(np.uint8))
    if j == 0:
        cv2.imwrite(f'{S}/poster.png', np.dstack([col, al * 255]).clip(0, 255).astype(np.uint8))
print('frames', B - A, 'size', W, H * 2 + GAP)
