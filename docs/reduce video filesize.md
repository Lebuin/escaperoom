Divide the scale by 3 and convert to grayscale:

```
ffmpeg -i orig.mp4 -vf 'scale=iw/3:ih/3, hue=s=0' escape.mp4
```
