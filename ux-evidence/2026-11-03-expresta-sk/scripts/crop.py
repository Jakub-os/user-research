import sys
from PIL import Image
im=Image.open(sys.argv[1]);x,y,w,h=map(int,sys.argv[3:7]);im.crop((x,y,x+w,y+h)).save(sys.argv[2])
