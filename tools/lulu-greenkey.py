import cv2, numpy as np, glob, os, sys
X0,Y0,X1,Y1=470,40,1260,1040      # спільна рамка для обох відео
def key(bgr):
    im=bgr.astype(np.float32)
    b,g,r=im[...,0],im[...,1],im[...,2]
    gd=g-np.maximum(r,b)
    a=np.clip((175-gd)/140,0,1)
    a=np.clip((a-0.12)/0.88,0,1)                                     # трохи стискаємо край
    GREEN=np.array([26,238,17],np.float32)
    a3=a[...,None]
    fg=np.where(a3>0.02,(im-(1-a3)*GREEN)/np.maximum(a3,0.02),im)   # прибираємо домішку зеленого фону з напівпрозорих країв
    b,g,r=fg[...,0],fg[...,1],fg[...,2]
    g=np.minimum(g,r)                                                # залишки зеленого відсвіту (у Lulu зелений ніде не більший за червоний)
    return np.dstack([b,g,r]).clip(0,255),a
if __name__=='__main__':
    name=sys.argv[1]
    os.makedirs(name+'-k',exist_ok=True)
    for f in sorted(glob.glob(name+'-f/*.png')):
        c,a=key(cv2.imread(f)[Y0:Y1,X0:X1])
        cv2.imwrite(name+'-k/'+os.path.basename(f),np.dstack([c,a*255]).clip(0,255).astype(np.uint8))
