import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../directives/reveal.directive';
import { TextRevealDirective } from '../../directives/text-reveal.directive';
import { PRODUCTS, formatPrice } from '../../shared/catalog';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [RouterLink, RevealDirective, TextRevealDirective],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  readonly products = PRODUCTS;

  formatPrice(value: number): string {
    return formatPrice(value);
  }
}
