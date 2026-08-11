import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { RULES } from '../../shared/catalog';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './rules.html',
  styleUrl: './rules.scss',
})
export class Rules {
  readonly rules = RULES;
}
