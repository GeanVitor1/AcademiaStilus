import { Component, signal } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { TrackActiveDirective } from '../../directives/track-active.directive';
import { MODALITIES } from '../../shared/catalog';

@Component({
  selector: 'app-modalities',
  standalone: true,
  imports: [RevealDirective, TrackActiveDirective],
  templateUrl: './modalities.html',
  styleUrl: './modalities.scss',
})
export class Modalities {
  readonly modalities = MODALITIES;
  readonly activeIndex = signal(0);
  readonly captionIndex = signal(-1);

  onActiveChange(active: boolean, index: number): void {
    if (active) {
      this.activeIndex.set(index);
      this.captionIndex.set(index);
    }
  }
}
