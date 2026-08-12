import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './facilities.html',
  styleUrl: './facilities.scss',
})
export class Facilities {
  readonly ownerPhoto = 'assets/dono.jpeg';

  readonly facilities = [
    { name: 'Música', icon: 'ph-music-notes' },
    { name: 'Banheiros', icon: 'ph-toilet' },
    { name: 'Vestiários', icon: 'ph-shirt-folded' },
    { name: 'WI-FI', icon: 'ph-wifi-high' },
    { name: 'Professores acompanhando', icon: 'ph-chalkboard-teacher' },
  ];
}
