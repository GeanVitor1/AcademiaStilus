import { Component, inject } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { TextRevealDirective } from '../../directives/text-reveal.directive';
import { PLANS } from '../../shared/catalog';
import { WhatsAppService } from '../../shared/whatsapp.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [RevealDirective, TextRevealDirective],
  templateUrl: './plans.html',
  styleUrl: './plans.scss',
})
export class Plans {
  readonly plans = PLANS;
  private readonly wa = inject(WhatsAppService);

  planLink(name: string): string {
    return this.wa.link(`Olá! Quero o plano ${name} da Academia Stilus.`);
  }
}
