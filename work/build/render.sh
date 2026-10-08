set -e
cd "$(dirname "$0")"
OUT="../../final"; mkdir -p $OUT
#
#
for ar in 16x9 9x16; do
 for v in kin sub; do
  name=MAIA_launch_$ar; [ $v = sub ] && name=${name}_subtitled
  ffmpeg -y -loglevel error -i base_$ar.mp4 -i master.wav -vf "ass=${v}_$ar.ass:fontsdir=fonts" -map 0:v -map 1:a -c:v libx264 -crf 17 -preset medium -pix_fmt yuv420p -r 30 -c:a aac -b:a 256k -ar 48000 -ac 2 -movflags +faststart -shortest $OUT/$name.mp4 &
 done
done
wait
