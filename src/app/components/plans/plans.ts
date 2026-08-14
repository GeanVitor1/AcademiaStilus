import { Component, inject } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { TextRevealDirective } from '../../directives/text-reveal.directive';
import { GymPlan, PLANS } from '../../shared/catalog';
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

  planLink(plan: GymPlan): string {
    const message =
      plan.id === 'gympass'
        ? 'Olá! Tenho Gympass ou Total Pass e quero treinar na Academia Stilus.'
        : `Olá! Quero o plano ${plan.name} da Academia Stilus.`;
    return this.wa.link(message);
  }
}
