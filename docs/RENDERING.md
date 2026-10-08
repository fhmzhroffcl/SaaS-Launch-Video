# Rendering Guide

## 1. Environment

Install Node.js 20 or newer, npm, FFmpeg, Python 3.11 or newer, and Google Chrome or Chromium.

```bash
node --version
npm --version
ffmpeg -version
python3 --version
```

## 2. Remotion scenes

```bash
cd motion_a/proj
npm ci
npx remotion compositions src/indexL.ts
./renderL.sh s2-16x9 s2-9x16 s3a-16x9 s3a-9x16 s3b-16x9 s3b-9x16
```

The six MP4 files are written to `motion_a/out/`.

Render one diagnostic still before a full scene:

```bash
npx remotion still src/indexL.ts s2-16x9 /tmp/s2-check.png --frame=180
```

## 3. Document and ERP scenes

```bash
cd motion_b
npm install
npm run render:all
```

`motion_b/src/render.js` checks common Chrome locations. Override discovery when needed:

```bash
export CHROME_PATH=/absolute/path/to/chrome
```

Render a single scene:

```bash
npm run render -- same "" 16x9
npm run render -- review "" 9x16
```

Render selected diagnostic frames without producing an MP4:

```bash
npm run render -- recap "0,1,3.5" 16x9
```

Stills are written under `/tmp/stills_<scene>_<format>/`.

## 4. Full 101.5-second assembly

The final edit references external licensed assets. Supply:

```text
$MAIA_LOGO_DIR/logo_intro_16x9.mp4
$MAIA_LOGO_DIR/logo_intro.mp4
$MAIA_LOGO_DIR/logo_outro_en_16x9.mp4
$MAIA_LOGO_DIR/logo_outro_en.mp4
$MAIA_BGM
$MAIA_SFX_DIR/*.wav
```

Then run:

```bash
export MAIA_LOGO_DIR=/absolute/path/to/logo-clips
export MAIA_BGM=/absolute/path/to/music.mp3
export MAIA_SFX_DIR=/absolute/path/to/sfx-library

cd work/build
python3 -m pip install -r requirements.txt
python3 build_base.py 16x9
python3 build_base.py 9x16
python3 caps.py
python3 audio.py
sh render.sh
```

Final files are written to `final/` at the launch-film project root.

## 5. Verification checklist

- Both aspect ratios render at 30 fps.
- No frame is blank, clipped, or missing an asset.
- Order numbers, quantities, RM prices, and customer details match `motion_a/ORDER_DATA.md`.
- Captions stay within the safe areas documented in `motion_b/NOTES.md`.
- Audio is synchronized and free of clipping.
- The final duration is approximately 101.5 seconds.

```bash
ffprobe -v error -show_entries stream=width,height,r_frame_rate -show_entries format=duration -of default=nw=1 final/MAIA_launch_16x9.mp4
ffmpeg -v error -i final/MAIA_launch_16x9.mp4 -f null -
```
