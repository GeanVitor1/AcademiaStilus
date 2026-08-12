import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { TextRevealDirective } from '../../directives/text-reveal.directive';
import { RULES } from '../../shared/catalog';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [RevealDirective, TextRevealDirective],
  templateUrl: './rules.html',
  styleUrl: './rules.scss',
})
export class Rules {
  readonly rules = RULES;
}
