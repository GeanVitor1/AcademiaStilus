import { Component, inject, signal } from '@angular/core';
import { GYM_INSTAGRAM_URL, NAV_LINKS } from '../../shared/catalog';
import { WhatsAppService } from '../../shared/whatsapp.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly navLinks = NAV_LINKS;
  readonly menuOpen = signal(false);
  readonly instagramUrl = GYM_INSTAGRAM_URL;
  private readonly whatsapp = inject(WhatsAppService);

  get whatsappUrl(): string {
    return this.whatsapp.contactUrl;
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
