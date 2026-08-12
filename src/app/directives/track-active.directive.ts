import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  Output,
} from '@angular/core';

@Directive({ selector: '[appTrackActive]' })
export class TrackActiveDirective implements AfterViewInit, OnDestroy {
  @Output() activeChange = new EventEmitter<boolean>();

  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private readonly onFallbackScroll = () => this.emitForRect();

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            this.activeChange.emit(entry.isIntersecting);
          }
        },
        { threshold: 0.5 }
      );
      this.observer.observe(node);
      return;
    }
    this.emitForRect();
    window.addEventListener('scroll', this.onFallbackScroll, { passive: true });
    window.addEventListener('resize', this.onFallbackScroll);
  }

  private emitForRect(): void {
    const node = this.el.nativeElement;
    const rect = node.getBoundingClientRect();
    this.activeChange.emit(rect.top < window.innerHeight && rect.bottom > 0);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    window.removeEventListener('scroll', this.onFallbackScroll);
    window.removeEventListener('resize', this.onFallbackScroll);
  }
}
