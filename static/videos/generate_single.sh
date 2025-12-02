# ffmpeg -y -i church.mp4 -filter_complex "
#   split=2[a][b];
#   [a]crop=488:544:0:0[L];
#   [b]crop=488:544:1464:0[R];
#   [L][R]hstack=inputs=2[stack];
#   [stack]drawbox=x=488:y=0:w=8:h=544:color=white:t=fill[out]
# " -map "[out]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p church_single.mp4

# ffmpeg -y -i church.mp4 -filter_complex "
# split=2[a][b];
# [a]crop=976:544:0:0[L];
# [b]crop=976:544:976:0[R];
# [L][R]blend=all_expr='if(lte(X,W*abs(mod(T/2,2)-1)),A,B)'[blend];
# [blend]geq=lum='if(between(X, W*abs(mod(T/2,2)-1)-4, W*abs(mod(T/2,2)-1)+4),255,lum(X,Y))':cb='cb(X,Y)':cr='cr(X,Y)'[out]
# " -map "[out]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p church_single.mp4

# ffmpeg -y -i church.mp4 -filter_complex "
# split=2[a][b];
# [a]crop=976:544:0:0[L];
# [b]crop=976:544:976:0[R];
# [L][R]blend=all_expr='if(lte(X,W*abs(mod(T/2.1825,2)-1)),A,B)'[blend];
# [blend]geq=lum='if(between(X, W*abs(mod(T/2.1825,2)-1)-4, W*abs(mod(T/2.1825,2)-1)+4),255,lum(X,Y))':cb='cb(X,Y)':cr='cr(X,Y)'[out]
# " -map "[out]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p church_single.mp4

ffmpeg -y -i church.mp4 -filter_complex "
split=2[a][b];
[a]crop=976:544:0:0[L];
[b]crop=976:544:976:0[R];
[L][R]blend=all_expr='if(lte(X,W/2-W/2*sin(2*PI*T/2.185)),A,B)'[blend];
[blend]geq=lum='if(between(X, W/2-W/2*sin(2*PI*T/2.185)-2, W/2-W/2*sin(2*PI*T/2.185)+2),255,lum(X,Y))':cb='cb(X,Y)':cr='cr(X,Y)'[out]
" -map "[out]" -c:v libx264 -crf 16 -preset slow -pix_fmt yuv420p church_single.mp4