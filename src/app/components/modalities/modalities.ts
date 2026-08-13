import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { TextRevealDirective } from '../../directives/text-reveal.directive';
import { TrackActiveDirective } from '../../directives/track-active.directive';
import { MODALITIES } from '../../shared/catalog';

const NOTCH_PX = 120;
const STEP_PX = 240;
const SWIPE_PX = 40;
const SNAP_MS = 420;

@Component({
  selector: 'app-modalities',
  standalone: true,
  imports: [RevealDirective, TrackActiveDirective, TextRevealDirective],
  templateUrl: './modalities.html',
  styleUrl: './modalities.scss',
})
export class Modalities implements AfterViewInit, OnDestroy {
  readonly modalities = MODALITIES;
  readonly activeIndex = signal(0);
  readonly captionIndex = signal(0);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly isTouch =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;

  private items: HTMLElement[] = [];
  private stageEl?: HTMLElement;
  private currentTarget = 0;
  private deltaAccum = 0;
  private animating = false;
  private exitDir = 0;
  private touchIntercepting = false;
  private touchStartX = 0;
  private touchStartY = 0;
  private touchLastY = 0;

  private readonly onWheelBound = (event: WheelEvent) => this.onWheel(event);
  private readonly onTouchStartBound = (event: TouchEvent) =>
    this.onTouchStart(event);
  private readonly onTouchMoveBound = (event: TouchEvent) =>
    this.onTouchMove(event);
  private readonly onTouchEndBound = () => this.onTouchEnd();
  private readonly onScrollBound = () => this.updateTouchAction();

  ngAfterViewInit(): void {
    this.items = Array.from(
      this.el.nativeElement.querySelectorAll('.modality-item')
    );
    this.currentTarget = this.positionIndex();
    this.el.nativeElement.addEventListener('wheel', this.onWheelBound, {
      passive: false,
    });
    if (this.isTouch) {
      const stage = this.el.nativeElement.querySelector('.modalities-stage');
      if (stage instanceof HTMLElement) {
        this.stageEl = stage;
        stage.addEventListener('touchstart', this.onTouchStartBound, {
          passive: true,
        });
        stage.addEventListener('touchmove', this.onTouchMoveBound, {
          passive: false,
        });
        stage.addEventListener('touchend', this.onTouchEndBound, {
          passive: true,
        });
        window.addEventListener('scroll', this.onScrollBound, { passive: true });
        window.addEventListener('resize', this.onScrollBound);
        this.updateTouchAction();
      }
    }
  }

  onActiveChange(active: boolean, index: number): void {
    if (active) {
      this.activeIndex.set(index);
      this.captionIndex.set(index);
    }
  }

  private coversViewport(): boolean {
    const rect = this.el.nativeElement.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom >= window.innerHeight;
  }

  private onWheel(event: WheelEvent): void {
    if (this.isTouch || event.deltaY === 0) return;
    if (!this.coversViewport()) {
      this.exitDir = 0;
      return;
    }

    const dir = Math.sign(event.deltaY);
    if (dir === this.exitDir) return;
    this.exitDir = 0;

    if (!this.animating) {
      this.currentTarget = this.positionIndex();
    }

    const px =
      event.deltaMode === 1
        ? event.deltaY * 16
        : event.deltaMode === 2
          ? event.deltaY * window.innerHeight
          : event.deltaY;
    this.addDelta(px >= 40 ? NOTCH_PX : px, dir);
    event.preventDefault();
  }

  private onTouchStart(event: TouchEvent): void {
    if (!this.coversViewport() || event.touches.length !== 1) {
      this.touchIntercepting = false;
      return;
    }
    if (!this.animating) {
      this.currentTarget = this.positionIndex();
    }
    this.touchIntercepting = true;
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchLastY = touch.clientY;
  }

  private onTouchMove(event: TouchEvent): void {
    if (!this.touchIntercepting) return;
    const touch = event.touches[0];
    const dx = touch.clientX - this.touchStartX;
    const dy = touch.clientY - this.touchStartY;
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
      event.preventDefault();
    }
    this.touchLastY = touch.clientY;
  }

  private onTouchEnd(): void {
    if (!this.touchIntercepting) return;
    this.touchIntercepting = false;
    const dy = this.touchLastY - this.touchStartY;
    if (Math.abs(dy) < SWIPE_PX) return;
    const dir = dy < 0 ? 1 : -1;
    if (dir === this.exitDir) return;
    this.exitDir = 0;
    this.addDelta(STEP_PX, dir);
  }

  private addDelta(px: number, dir: number): void {
    this.deltaAccum =
      Math.sign(this.deltaAccum) !== dir ? px : this.deltaAccum + px;
    this.trySnap();
  }

  private trySnap(): void {
    if (this.animating) return;
    const dir = Math.sign(this.deltaAccum);
    if (Math.abs(this.deltaAccum) < STEP_PX) return;
    const target = this.currentTarget + dir;
    if (target < 0 || target >= this.items.length) {
      this.exitDir = dir;
      this.deltaAccum = 0;
      if (this.isTouch) {
        this.scrollOut(dir);
      }
      return;
    }
    this.deltaAccum -= dir * STEP_PX;
    this.currentTarget = target;
    this.animateTo(target);
  }

  private animateTo(target: number): void {
    this.animating = true;
    const top = this.items[target].getBoundingClientRect().top + window.scrollY;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (reduceMotion) {
      window.scrollTo({ top, behavior: 'auto' });
      this.animating = false;
      this.trySnap();
      return;
    }
    this.animateScroll(top, SNAP_MS, () => {
      this.animating = false;
      this.trySnap();
    });
  }

  private scrollOut(dir: number): void {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const top =
      dir > 0
        ? this.items[this.items.length - 1].getBoundingClientRect().top +
          window.scrollY +
          window.innerHeight
        : this.el.nativeElement.getBoundingClientRect().top + window.scrollY;
    if (reduceMotion) {
      window.scrollTo({ top, behavior: 'auto' });
      return;
    }
    this.animateScroll(top, SNAP_MS, () => undefined);
  }

  private animateScroll(
    targetTop: number,
    duration: number,
    onDone: () => void
  ): void {
    const start = window.scrollY;
    const distance = targetTop - start;
    if (Math.abs(distance) < 1) {
      onDone();
      return;
    }
    const startTime = performance.now();
    const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);
    const step = (now: number): void => {
      const t = Math.min(1, (now - startTime) / duration);
      window.scrollTo({ top: start + distance * easeOut(t), behavior: 'instant' });
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        onDone();
      }
    };
    requestAnimationFrame(step);
  }

  private updateTouchAction(): void {
    if (!this.stageEl) return;
    const action = this.coversViewport() ? 'pan-x pinch-zoom' : '';
    if (this.stageEl.style.touchAction !== action) {
      this.stageEl.style.touchAction = action;
    }
  }

  private positionIndex(): number {
    const count = this.items.length;
    if (count === 0) return 0;
    const scrollY = window.scrollY;
    const first = this.items[0];
    const firstCenter =
      first.getBoundingClientRect().top + scrollY + first.offsetHeight * 0.5;
    const step = first.offsetHeight;
    const viewportCenter = scrollY + window.innerHeight * 0.5;
    const index = Math.round((viewportCenter - firstCenter) / step);
    return Math.max(0, Math.min(count - 1, index));
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('wheel', this.onWheelBound);
    if (this.stageEl) {
      this.stageEl.removeEventListener('touchstart', this.onTouchStartBound);
      this.stageEl.removeEventListener('touchmove', this.onTouchMoveBound);
      this.stageEl.removeEventListener('touchend', this.onTouchEndBound);
      window.removeEventListener('scroll', this.onScrollBound);
      window.removeEventListener('resize', this.onScrollBound);
    }
  }
}
