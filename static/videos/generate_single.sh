ffmpeg -y -i church.mp4 -filter_complex "
  split=2[a][b];
  [a]crop=488:544:0:0[L];
  [b]crop=488:544:1464:0[R];
  [L][R]hstack=inputs=2[stack];
  [stack]drawbox=x=488:y=0:w=8:h=544:color=white:t=fill[out]
" -map "[out]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p church_single.mp4