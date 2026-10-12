import cv2, numpy as np, sys, os
CREAM=np.array([0xF2,0xF9,0xFF],np.float32)
def key(im):
    imu=im; im=im.astype(np.float32)
    d=np.sqrt(((im-CREAM)**2).sum(-1))
    soft=np.clip((d-6)/18,0,1)
    hsv=cv2.cvtColor(imu,cv2.COLOR_BGR2HSV).astype(np.float32)
    yy=np.arange(im.shape[0])[:,None]/im.shape[0]
    warm=(im[...,0]-im[...,2])<-3                         # тінь тепла (червоного більше за синій), лапки й хутро — холодні
    shadowish=((hsv[...,1]<26)&(hsv[...,2]<238)) | ((yy>0.78)&warm&(d<45))   # тінь на підлозі
    core=((soft>0.35)&~shadowish).astype(np.uint8)
    core=cv2.morphologyEx(core,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9)))
    n,lab,st,_=cv2.connectedComponentsWithStats(core)
    if n>1: core=(lab==1+np.argmax(st[1:,cv2.CC_STAT_AREA])).astype(np.uint8)
    h,w=core.shape; flood=core.copy(); m=np.zeros((h+2,w+2),np.uint8); cv2.floodFill(flood,m,(0,0),2)
    core=((flood==0)|(core==1)).astype(np.uint8)          # заповнили дірки (мордочка, картка)
    inner=cv2.erode(core,np.ones((5,5),np.uint8))
    near=cv2.dilate(core,np.ones((5,5),np.uint8))
    a=np.where(inner>0,1.0,soft*near*(~shadowish))
    a=cv2.GaussianBlur(a.astype(np.float32),(3,3),0)
    a3=a[...,None]
    fg=np.where(a3>0.05,(im-(1-a3)*CREAM)/np.maximum(a3,0.05),im).clip(0,255)
    return np.dstack([fg,a*255]).astype(np.uint8)
src,dst,W,H=sys.argv[1],sys.argv[2],int(sys.argv[3]),int(sys.argv[4])
os.makedirs(dst,exist_ok=True)
for i,f in enumerate(sys.argv[5:]):
    im=cv2.resize(cv2.imread(os.path.join(src,f)),(W,H),interpolation=cv2.INTER_AREA)
    cv2.imwrite(os.path.join(dst,'%02d.png'%i),key(im))
