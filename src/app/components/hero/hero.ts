import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';
import { TEACHER_COUNT } from '../../shared/catalog';
import { WhatsAppService } from '../../shared/whatsapp.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('heroWrapper', { read: ElementRef }) private readonly wrapperRef!: ElementRef<HTMLElement>;
  @ViewChild('scrubVideo', { read: ElementRef }) private readonly videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('scrubVideoRev', { read: ElementRef }) private readonly revRef!: ElementRef<HTMLVideoElement>;

  readonly teacherCount = TEACHER_COUNT;
  readonly textOpacity = signal(1);
  readonly reverseActive = signal(false);
  readonly reverseReady = signal(true);
  private readonly wa = inject(WhatsAppService);

  private video: HTMLVideoElement | null = null;
  private rev: HTMLVideoElement | null = null;
  private rafId = 0;
  private aliveId = 0;
  private lastScrollY = -1;
  private lastGoingDown = true;
  private lastScrollAt = 0;

  get whatsappUrl(): string {
    return this.wa.contactUrl;
  }

  ngAfterViewInit(): void {
    this.video = this.videoRef.nativeElement;
    this.rev = this.revRef.nativeElement;
    this.rev.muted = true;
    this.rev.defaultMuted = true;
    this.rev.pause();
    this.video.addEventListener('loadedmetadata', this.onMetadata);
    this.video.addEventListener('durationchange', this.onMetadata);
    this.applyPin();
    this.onMetadata();
    this.scrub();
    window.addEventListener('scroll', this.scheduleScrub, { passive: true });
    window.addEventListener('resize', this.scheduleResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scheduleScrub);
    window.removeEventListener('resize', this.scheduleResize);
    cancelAnimationFrame(this.rafId);
    cancelAnimationFrame(this.aliveId);
    this.video?.removeEventListener('loadedmetadata', this.onMetadata);
    this.video?.removeEventListener('durationchange', this.onMetadata);
  }

  private onMetadata = (): void => {
    const v = this.video;
    if (!v) {
      return;
    }
    v.pause();
    v.muted = true;
    v.defaultMuted = true;
    if (Number.isFinite(v.duration) && v.duration > 0) {
      const range = Math.min(6, Math.max(2.5, v.duration * 0.6));
      this.wrapperRef.nativeElement.style.setProperty('--scrub-range', range.toFixed(2));
    }
  };

  private isMobile(): boolean {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  private applyPin = (): void => {
    if (this.video) {
      this.video.loop = false;
    }
    const about = document.getElementById('academia');
    const aboutH = about ? about.getBoundingClientRect().height : 2 * window.innerHeight;
    const height = aboutH + window.innerHeight;
    this.wrapperRef.nativeElement.style.height = `${Math.round(height)}px`;
  };

  private scheduleScrub = (): void => {
    this.lastScrollAt = performance.now();
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.scrub);
  };

  private scheduleResize = (): void => {
    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      this.applyPin();
      this.scrub();
    });
  };

  private scrub = (): void => {
    const main = this.video;
    const rev = this.rev;
    if (!main || !rev || !Number.isFinite(main.duration) || main.duration <= 0) {
      return;
    }
    const wrapper = this.wrapperRef.nativeElement;
    const rect = wrapper.getBoundingClientRect();
    const scrollY = Math.max(0, -rect.top);
    const travel = Math.max(1, rect.height - window.innerHeight);
    const progress = Math.min(1, scrollY / travel);
    if (this.isMobile()) {
      this.textOpacity.set(1);
    } else {
      this.textOpacity.set(1 - Math.min(1, progress / 0.6));
    }
    const downTarget = Math.min(main.duration, (scrollY / travel) * main.duration);
    const upTarget = Math.min(main.duration, (scrollY / rect.height) * main.duration);
    const goingDown = scrollY > this.lastScrollY || (scrollY === this.lastScrollY && this.lastGoingDown);
    this.lastGoingDown = goingDown;
    const time = goingDown ? downTarget : upTarget;
    const useRev = !goingDown;
    this.lastScrollY = scrollY;

    if (useRev !== this.reverseActive()) {
      this.reverseReady.set(false);
      if (useRev) {
        rev.currentTime = Math.max(0, rev.duration - main.currentTime);
        main.pause();
      } else {
        main.currentTime = Math.min(main.duration, main.duration - rev.currentTime);
        rev.pause();
      }
      this.reverseActive.set(useRev);
      const incoming = useRev ? rev : main;
      const atEnd = useRev ? time < 0.02 : time > main.duration - 0.02;
      const onSeeked = (): void => {
        incoming.removeEventListener('seeked', onSeeked);
        window.clearTimeout(readyTimer);
        this.reverseReady.set(true);
      };
      incoming.addEventListener('seeked', onSeeked);
      const readyTimer = window.setTimeout(onSeeked, 250);
      if (atEnd) {
        incoming.pause();
      } else {
        incoming.play().catch(() => this.reverseReady.set(true));
      }
      this.startLoop();
    }

    const active = useRev ? rev : main;
    const targetPos = useRev ? Math.min(rev.duration, rev.duration - time) : time;
    if (active.ended) {
      active.pause();
      return;
    }
    const diff = targetPos - active.currentTime;
    const idle = performance.now() - this.lastScrollAt > 150;
    if (Math.abs(diff) > 1.2) {
      active.currentTime = targetPos;
      return;
    }
    if (idle && Math.abs(diff) < 0.012) {
      active.pause();
      return;
    }
    active.playbackRate = Math.max(-8, Math.min(8, diff * 14));
    if (active.paused && !active.ended) {
      active.play().catch(() => undefined);
      this.startLoop();
    }
  };

  private startLoop = (): void => {
    if (this.aliveId) {
      return;
    }
    const tick = (): void => {
      this.aliveId = 0;
      const v = this.video;
      const r = this.rev;
      if ((!v || v.paused) && (!r || r.paused)) {
        return;
      }
      this.scrub();
      this.aliveId = requestAnimationFrame(tick);
    };
    this.aliveId = requestAnimationFrame(tick);
  };
}
