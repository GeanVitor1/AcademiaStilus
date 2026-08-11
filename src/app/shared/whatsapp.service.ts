import { Injectable } from '@angular/core';

const WHATSAPP_PHONE = '5573988012427';

@Injectable({ providedIn: 'root' })
export class WhatsAppService {
  readonly phoneDisplay = '(73) 98801-2427';

  readonly contactUrl =
    'https://api.whatsapp.com/send/?phone=5573988012427&text&type=phone_number&app_absent=0&utm_source=ig';

  link(message?: string): string {
    if (!message) {
      return this.contactUrl;
    }
    return `https://api.whatsapp.com/send/?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
  }
}
