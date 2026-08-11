import { Component, inject } from '@angular/core';
import { TEACHER_COUNT } from '../../shared/catalog';
import { WhatsAppService } from '../../shared/whatsapp.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly teacherCount = TEACHER_COUNT;
  private readonly wa = inject(WhatsAppService);

  get whatsappUrl(): string {
    return this.wa.contactUrl;
  }
}
