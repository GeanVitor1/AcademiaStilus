import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { MODALITIES, TEACHER_COUNT } from '../../shared/catalog';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  readonly teacherCount = TEACHER_COUNT;
  readonly modalityCount = MODALITIES.length;
}
