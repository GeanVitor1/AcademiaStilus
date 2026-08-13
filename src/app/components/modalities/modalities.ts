import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { TextRevealDirective } from '../../directives/text-reveal.directive';
import { TrackActiveDirective } from '../../directives/track-active.directive';
import { MODALITIES } from '../../shared/catalog';

@Component({
  selector: 'app-modalities',
  standalone: true,
  imports: [RevealDirective, TrackActiveDirective, TextRevealDirective],
  templateUrl: './modalities.html',
  styleUrl: './modalities.scss',
})
export class Modalities implements AfterViewInit {
  readonly modalities = MODALITIES;
  readonly activeIndex = signal(0);
  readonly captionIndex = signal(0);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly stepPx = 240;
  private items: HTMLElement[] = [];
  private deltaAccum = 0;
  private exitDir = 0;
  private readonly onWheelBound = (event: WheelEvent) => this.onWheel(event);

  ngAfterViewInit(): void {
    this.items = Array.from(this.el.nativeElement.querySelectorAll('.modality-item'));
    this.el.nativeElement.addEventListener('wheel', this.onWheelBound, {
      passive: false,
    });
  }

  onActiveChange(active: boolean, index: number): void {
    if (active) {
      this.activeIndex.set(index);
      this.captionIndex.set(index);
    }
  }

  private onWheel(event: WheelEvent): void {
    if (event.deltaY === 0) return;

    const section = this.el.nativeElement;
    const rect = section.getBoundingClientRect();
    const coversViewport = rect.top <= 0 && rect.bottom >= window.innerHeight;
    if (!coversViewport) {
      this.exitDir = 0;
      return;
    }

    const dir = Math.sign(event.deltaY);
    if (dir === this.exitDir) return;
    this.exitDir = 0;

    const px =
      event.deltaMode === 1
        ? event.deltaY * 16
        : event.deltaMode === 2
          ? event.deltaY * window.innerHeight
          : event.deltaY;
    this.deltaAccum = Math.sign(this.deltaAccum) !== dir ? px : this.deltaAccum + px;

    if (Math.abs(this.deltaAccum) < this.stepPx) {
      event.preventDefault();
      return;
    }

    const target = this.positionIndex() + dir;
    if (target < 0 || target >= this.items.length) {
      this.exitDir = dir;
      this.deltaAccum = 0;
      return;
    }

    event.preventDefault();
    this.deltaAccum = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: this.items[target].getBoundingClientRect().top + window.scrollY,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
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
  }
}
