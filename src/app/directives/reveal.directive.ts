import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  Input,
  OnDestroy,
} from '@angular/core';

@Directive({ selector: '[appReveal]' })
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input() appRevealDelay = 0;

  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private readonly reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    if (this.reduced.matches || !('IntersectionObserver' in window)) {
      node.classList.add('is-visible');
      return;
    }
    node.classList.add('reveal');
    if (this.appRevealDelay > 0) {
      node.style.transitionDelay = `${this.appRevealDelay}ms`;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add('is-visible');
            this.observer?.unobserve(node);
          }
        }
      },
      { threshold: 0.15 }
    );
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
