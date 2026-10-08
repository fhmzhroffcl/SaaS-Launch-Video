# AI Render Prompt

Paste this into a coding agent that has access to the repository:

```text
You are responsible for verifying and rendering the MAIA SaaS launch-video project in this repository.

Do not redesign or rewrite the story, order data, brand text, prices, customer details, or timing unless I explicitly ask. Treat the existing source and documentation as the source of truth.

First read README.md, docs/RENDERING.md, motion_a/ORDER_DATA.md, work/VO_TIMING.md, and motion_b/NOTES.md.

Work in this order:
1. Inspect the repository and report missing dependencies or external assets.
2. Install dependencies for motion_a/proj and motion_b.
3. List the Remotion compositions and confirm the expected six launch compositions exist.
4. Render representative static frames for s2, s3a, s3b, same-order, review-confirm, ERP-sync, and recap in both 16:9 and 9:16.
5. Inspect for blank output, clipping, missing fonts, missing images, bad text wrapping, unreadable order data, or inconsistent branding.
6. Fix only reproducibility or rendering defects. Preserve approved creative decisions.
7. Render all scene MP4 files at 30 fps using the repository's existing quality settings.
8. Verify every output with ffprobe and an FFmpeg decode pass. Report resolution, frame rate, duration, audio presence, and file size.
9. If external assets are available through MAIA_LOGO_DIR, MAIA_BGM, and MAIA_SFX_DIR, assemble and verify the complete 101.5-second 16:9 and 9:16 films. Otherwise stop after scene renders and list the exact missing assets.

Deliver a concise status report, paths to rendered stills and MP4 files, source files changed, verification evidence, and remaining limitations.

Do not claim success unless the output exists, ffprobe can read it, and FFmpeg decodes it without errors.
```

For a static-image-only review, replace steps 7-9 with:

```text
Stop after the diagnostic stills. Build one contact sheet per aspect ratio, label each frame with its scene ID and timestamp, and report visual defects without rendering full videos.
```
