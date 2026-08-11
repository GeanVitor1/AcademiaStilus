# Academia Stilus

Site institucional da Academia Stilus (Ilhéus - BA), desenvolvido em Angular 22.

Identidade visual: preto e amarelo, tema escuro, tipografia Archivo (variável).

## Funcionalidades

- Apresentação da academia, modalidades (Treinamento Funcional, HitDance, FitDance, Clube de Ciclismo, Aulas Coletivas, CrossOver)
- Seção de professores (19) e cursos (Personal Trainer e Anamnese Clínica, professor Carlos Ribeiro)
- Loja de produtos (camisas e meias) com compra demonstrativa via Pix:
  - Escolha do produto, resumo da compra, QR Code fictício e simulação de pagamento
  - Após a simulação, redirecionamento para o WhatsApp com mensagem pronta sobre o pedido
- Regras da academia e mapa com localização + link para o Google Maps

Sem backend: todos os dados são estáticos (mockados) em `src/app/shared/catalog.ts`.

## Desenvolvimento

```bash
npm install
npm start
```

Abra `http://localhost:4200/`.

## Build

```bash
npm run build
```

Os artefatos ficam em `dist/academia-stilus/browser`.
