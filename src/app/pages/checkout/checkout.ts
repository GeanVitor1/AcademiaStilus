import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import QRCode from 'qrcode';
import { PRODUCTS, formatPrice } from '../../shared/catalog';
import { WhatsAppService } from '../../shared/whatsapp.service';

type PaymentState = 'pending' | 'paying' | 'paid';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly wa = inject(WhatsAppService);

  readonly productId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('productId') ?? ''))
  );

  readonly product = computed(
    () => PRODUCTS.find((p) => p.id === this.productId()) ?? null
  );

  readonly state = signal<PaymentState>('pending');
  readonly copied = signal(false);
  readonly qrDataUrl = signal('');
  readonly qrReady = signal(false);

  private timer?: ReturnType<typeof setTimeout>;
  private copyTimer?: ReturnType<typeof setTimeout>;

  readonly pixCode = computed(() => {
    const product = this.product();
    if (!product) {
      return '';
    }
    const amount = product.price.toFixed(2);
    return `00020126580014BR.GOV.BCB.PIX0136stilus-demo-${product.id}5204000053039865405${amount}5802BR5913ACADEMIA STILUS6009ILHEUS BA62070503***6304DEMO`;
  });

  readonly whatsappLink = computed(() => {
    const product = this.product();
    if (!product) {
      return this.wa.contactUrl;
    }
    const message = `Olá, realizei uma compra na Academia Stilus: ${product.name} (${formatPrice(product.price)}). Gostaria de confirmar meu pedido.`;
    return this.wa.link(message);
  });

  constructor() {
    effect(() => {
      const code = this.pixCode();
      if (!code) {
        return;
      }
      this.qrReady.set(false);
      void QRCode.toDataURL(code, {
        width: 320,
        margin: 1,
        color: { dark: '#0A0A0B', light: '#FFFFFF' },
      }).then((url) => {
        this.qrDataUrl.set(url);
        this.qrReady.set(true);
      });
    });
  }

  formatPrice(value: number): string {
    return formatPrice(value);
  }

  simulatePayment(): void {
    if (this.state() !== 'pending') {
      return;
    }
    this.state.set('paying');
    this.timer = setTimeout(() => this.state.set('paid'), 1800);
  }

  async copyPixCode(): Promise<void> {
    const code = this.pixCode();
    if (!code) {
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    this.copied.set(true);
    this.copyTimer = setTimeout(() => this.copied.set(false), 2000);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    clearTimeout(this.copyTimer);
  }
}
