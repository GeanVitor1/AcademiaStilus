import { Component, inject } from '@angular/core';
import { GYM_ADDRESS } from '../../shared/catalog';
import { WhatsAppService } from '../../shared/whatsapp.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly address = GYM_ADDRESS;
  private readonly wa = inject(WhatsAppService);
  readonly year = new Date().getFullYear();

  get whatsapp(): WhatsAppService {
    return this.wa;
  }
}
