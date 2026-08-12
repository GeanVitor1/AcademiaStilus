---
name: scroll-video-scrub
description: Use when building a scroll-driven (scroll-scrubbed) video animation — a video whose playback position is controlled by the page scroll (advance on scroll down, rewind on scroll up), typically pinned to a section. Covers the sticky-pin layout, the dual-video reversed-file technique for fluid rewind, playbackRate-based scrubbing, and the full troubleshooting checklist for choppy playback, black flashes, ended-video restarts, and direction-switch glitches. Triggers: "video controlled by scroll", "scroll scrub", "video animation on scroll", "video retrocede/avança com o scroll".
---

# Scroll-Driven Video Scrub (fluid, glitch-free)

A scroll-scrubbed video: the page section stays pinned while the user scrolls; the
video advances proportionally on scroll-down and rewinds proportionally on
scroll-up. This skill encodes the architecture and every bug fixed while building
the reference implementation at `src/app/components/hero/` (hero.ts, hero.html,
hero.scss) in this repo.

## Reference implementation

- Angular 17+ standalone component (`hero.ts`) — scroll listener + rAF loop.
- `hero.scss` — sticky pin + wrapper height.
- `hero.html` — two `<video>` elements (normal + reversed).

## 1. Layout: the sticky pin

```scss
.hero-scroll {            /* wrapper: provides the scroll runway */
  position: relative;
  height: <pinTravel + 100dvh>;   /* set in px from JS */
  padding-top: 64px;              /* header height — video starts BELOW the navbar */
}

.hero {
  position: sticky;
  top: 64px;              /* pins below the fixed navbar */
  height: calc(100dvh - 64px);
  overflow: hidden;
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;       /* or cover — see §5 */
}
```

Key rules learned the hard way:

- **The hero must start below the navbar from the very first pixel.** `top: 64px`
  alone is NOT enough: at scrollY=0 a sticky element sits at its natural position
  (page top) and the video hides under the navbar. Also put `padding-top: 64px`
  on the wrapper (or margin on the section) so the natural position is already
  below the navbar.
- **Pin travel must equal the video's scroll span** or the user feels "stuck":
  after the animation ends there must be no remaining forced scroll. Set the
  wrapper height in JS: `wrapperH = aboutSectionHeight + innerHeight` (measure
  the section that follows and re-measure on resize).
- A `position: sticky; top: 0` hero that releases only when the video ends
  produces dead scroll both directions; make the release coincide with the
  video's end.

## 2. Progress mapping

```ts
const scrollY = Math.max(0, -wrapperRect.top);
const travel = wrapperRect.height - window.innerHeight;   // pin span (down mapping)
const downTarget = Math.min(duration, (scrollY / travel) * duration);
const upTarget   = Math.min(duration, (scrollY / wrapperRect.height) * duration);
```

- **Forward mapping** (video completes at pin release): `downTarget`.
- **Rewind mapping** (rewind starts as soon as the user scrolls up from the
  following section and completes at the top): `upTarget` over the whole
  wrapper height. The two mappings differ at a given scrollY — that is
  intentional (asymmetric advance/rewind cadence).
- `time = goingDown ? downTarget : upTarget` — direction comes from comparing
  scrollY to the previous scrollY (see §4).

## 3. Fluid playback: playbackRate, never per-frame seeks

Seeking `video.currentTime` on every scroll frame is the #1 cause of "15fps"
choppiness: with keyframes every ~0.9s the decoder must decode ~20+ frames per
seek. Instead, PLAY the video toward the target:

```ts
const diff = targetPos - video.currentTime;
if (Math.abs(diff) > 1.2) {          // big jump (anchor, scrollbar drag): seek directly
  video.currentTime = targetPos;
  return;
}
video.playbackRate = Math.max(-8, Math.min(8, diff * 14));   // proportional catch-up
if (video.paused && !video.ended) video.play().catch(() => {});
```

Rules:

- Keep the video playing continuously while the user scrolls. **Do NOT pause and
  resume per frame** — each resume has startup latency (stutter). Pause only
  when idle (`now - lastScrollEventAt > 150ms`) and `|diff| < 0.012`.
- Run a self-sustaining rAF loop that re-runs the scrub while ANY video is
  playing, so the position stays glued to the target between scroll events.
  **Check both videos in the loop's stop condition** — a loop gated on only the
  main video dies during rewind (the reversed one plays while the main is
  paused), the video free-runs, overshoots, and flickers.
- Allow small negative playbackRate for tiny overshoot corrections instead of
  seeking (avoids decoder resets → black flashes).

## 4. Rewind: the reversed video (dual-video technique)

Negative `playbackRate` in Chromium is choppy (decode-from-keyframe bursts).
For a fluid rewind, generate a frame-reversed copy and play it FORWARD:

```bash
ffprobe  -v error -select_streams v:0 -show_entries stream=width,height,bit_rate -of default=noprint_wrappers=1 video.mp4
ffmpeg -y -v error -i video.mp4 -vf reverse -an -c:v libx264 -preset medium -crf 14 -movflags +faststart video-reverse.mp4
```

Match the original quality — a low-bitrate encode of the reversed file looks
like "a different resolution" to users (check bit_rate; original ~6.8 Mbps vs
a crf-20 encode at ~1.7 Mbps is a visible downgrade; crf 14 lands ~4.8 Mbps).

Then:

- Two `<video>` elements stacked (both `muted`, `playsinline`, `preload="auto"`).
- **Scroll direction selects the video** — down → normal video; up → reversed
  video. NEVER select by comparing position vs target: the catch-up playback
  overshoots, position-vs-target switches back and forth and the video
  oscillates (goes "back and forth") and even rewinds while scrolling down.
- Memory of the direction is required while idle: `goingDown = scrollY >
  lastScrollY || (scrollY === lastScrollY && lastGoingDown)`.
- On direction switch, mirror the position:
  `rev.currentTime = rev.duration - main.currentTime` (and vice-versa), pause
  the outgoing, play the incoming.
- **Gate the incoming video's visibility on readiness** (`reverseReady` signal):
  hide it until the mirror seek completed — use the `seeked` event with a
  ~250ms timeout fallback (the play() promise alone can resolve before the
  frame is painted → 1–2 frames of black). Keep the outgoing visible meanwhile,
  then crossfade (opacity transition ~0.15s).
- Durations of the two files differ slightly (reverse filter drops the last
  partial frame). Always mirror with each video's OWN duration
  (`rev.duration - main.currentTime`) — the ~10ms residual is imperceptible.

## 5. Object-fit: users react to crops

- `cover` on a 7:4 video in a 16:9 viewport crops top AND bottom — users
  complain about both, in sequence ("top cut", then "bottom cut").
- `contain` shows full video but leaves black side bands on tall viewports →
  "black borders on the sides".
- `fill` stretches to fill everything (no borders, no crop) — a ~8% horizontal
  stretch on 16:9 which users accept ("esticar a largura"). When asked to
  remove borders without zoom/crop, `fill` is the pragmatic answer.

## 6. The ended-video trap

Calling `play()` on an ended video (currentTime == duration) makes the browser
RESTART it from frame 0 — the classic "blinks showing fully rewound while at
100%" bug. Guard everything:

```ts
if (video.ended) { video.pause(); return; }        // before any catch-up logic
if (video.paused && !video.ended) video.play()...  // never play an ended video
```

Also handle the switch-to-video-at-an-end case: if the incoming mirror lands on
its own end (position 0 or duration), don't play it — pause it at that frame and
wait for the seek.

## 7. Video with an audio track

If `ffprobe` reports `aac`/`mp3` audio: set `muted` attribute AND
`video.muted = true; video.defaultMuted = true` programmatically. Playback-based
scrubbing plays the audio otherwise.

## 8. Optional polish: fade the overlay text on scroll

Expose a signal driven by the same progress:

```ts
textOpacity.set(1 - Math.min(1, progress / 0.6));   // fully gone at 60% of the pin
```

Bind to the copy panel and the background scrim with `transition: opacity 0.2s
linear`. It naturally fades back in on scroll-up.

## 9. Troubleshooting checklist (symptoms → causes)

| Symptom | Cause / fix |
| --- | --- |
| Choppy like 15fps, forward & back | Seeking per frame → use playbackRate catch-up (§3) |
| Forward fluid, rewind choppy | Negative playbackRate → reversed video file (§4) |
| Stutter while scrolling | pause/play per frame → play continuously, idle-pause only (§3) |
| Video drifts / never syncs after a few seconds | rAF loop died (gated on the wrong video) → check both videos (§3) |
| Blinks showing "fully rewound" while at the end | `play()` on an ended video restarts from 0 → `ended` guards (§6) |
| Black flashes while advancing | Seeks on the visible video reset the decoder → rate-only corrections (§3) |
| Oscillates back-and-forth / rewinds while scrolling down | Video selected by position vs target → select by scroll direction (§4) |
| Black flash at direction switch | Incoming video shown before its frame is ready → readiness gating (§4) |
| "Dead" scroll after the animation ends | Pin travel longer than the video span → equalize (§1) |
| Video cropped top/bottom or side borders | object-fit choice (§5) |
| Audio leaking | Mute attribute + programmatic muted (§7) |
| Video looks lower-res after encode | Reversed file encoded at low bitrate → crf 14 / match original bitrate (§4) |

## 10. Verify

- `ng build` after changes.
- Test in a real browser (headless automation cannot synthesize scrolling
  reliably on Windows Edge; geometry can be checked via CDP
  `Runtime.evaluate` + `getBoundingClientRect`).
- Users must hard-refresh (Ctrl+Shift+R) — dev-server JS is cached by browsers.
