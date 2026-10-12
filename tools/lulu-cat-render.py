# Відео «Lulu складає CAT» для першого екрана Practice: зелений фон → кремовий #FFF9F2, повтор без стику.
# Запуск: python3 tools/lulu-cat-render.py <папка з f/NNN.png> (кадри: ffmpeg -i відео.mp4 <папка>/f/%03d.png),
# далі ffmpeg кодує <папка>/out/*.png у webm і mp4 (див. docs/handoff.md).
import sys, glob, os, numpy as np, cv2
from importlib import util
spec = util.spec_from_file_location('gk', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lulu-greenkey.py')); gk = util.module_from_spec(spec); spec.loader.exec_module(gk)
S = sys.argv[1]
fs = sorted(glob.glob(S + '/f/*.png'))
N, K = 182, 12                      # повтор: кадри 0..181, останні 12 плавно переходять у початок
X0, Y0, X1, Y1 = 440, 16, 1480, 1080
CREAM = np.array([0xF2, 0xF9, 0xFF], np.float32)   # #FFF9F2 у BGR
H = 640
os.makedirs(S + '/out', exist_ok=True)
def comp(i):
    c, a = gk.key(cv2.imread(fs[i])[Y0:Y1, X0:X1])
    a = cv2.erode(a, np.ones((3, 3), np.uint8), iterations=3)      # зрізаємо сірий обідок від зеленого фону
    a = cv2.GaussianBlur(a, (5, 5), 0)
    a3 = a[..., None]
    return c * a3 + CREAM * (1 - a3)
for j in range(N - K):
    src = j + K
    img = comp(src)
    t = src - (N - K)
    if t >= 0:                       # останні K кадрів змішуємо з першими
        w = (t + 1) / (K + 1)
        img = img * (1 - w) + comp(t) * w
    w0 = round((X1 - X0) * H / (Y1 - Y0) / 2) * 2
    img = cv2.resize(img.clip(0, 255).astype(np.uint8), (w0, H), interpolation=cv2.INTER_AREA)
    cv2.imwrite(f'{S}/out/{j:03d}.png', img)
print('frames', N - K, 'size', w0, H)
