import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { TEACHER_COUNT } from '../../shared/catalog';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss',
})
export class Teachers {
  readonly teacherCount = TEACHER_COUNT;
  readonly tiles = Array.from({ length: TEACHER_COUNT }, (_, i) => i);
}
