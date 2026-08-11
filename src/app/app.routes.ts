import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'Academia Stilus - Treine forte em Ilhéus',
  },
  {
    path: 'checkout/:productId',
    loadComponent: () => import('./pages/checkout/checkout').then((m) => m.Checkout),
    title: 'Finalizar compra - Academia Stilus',
  },
  { path: '**', redirectTo: '' },
];
