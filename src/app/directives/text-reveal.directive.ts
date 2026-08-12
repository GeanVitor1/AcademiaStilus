import { AfterViewInit, Directive, ElementRef, inject, OnDestroy } from '@angular/core';

@Directive({ selector: '[appTextReveal]' })
export class TextRevealDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    const node = this.el.nativeElement;
    const words: string[] = (node.textContent ?? '').trim().split(/\s+/);
    node.textContent = '';

    const wrapper = document.createElement('span');
    wrapper.className = 'text-reveal';

    words.forEach((word, i) => {
      const wordWrap = document.createElement('span');
      wordWrap.className = 'text-reveal-word';

      const inner = document.createElement('span');
      inner.className = 'text-reveal-inner';
      inner.textContent = word;
      inner.style.transitionDelay = `${i * 60}ms`;

      wordWrap.appendChild(inner);
      wrapper.appendChild(wordWrap);
      if (i < words.length - 1) {
        wrapper.appendChild(document.createTextNode(' '));
      }
    });

    node.appendChild(wrapper);

    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            node.classList.add('is-visible');
            this.observer?.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      this.observer.observe(node);
    } else {
      node.classList.add('is-visible');
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
