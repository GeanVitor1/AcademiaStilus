export interface Modality {
  id: string;
  name: string;
  kicker: string;
  blurb: string;
  icon: string;
  image: string;
  teacher?: string;
  dim?: boolean;
}

export interface Course {
  id: string;
  name: string;
  blurb: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  blurb: string;
  price: number;
  image: string;
  category: 'Camisas' | 'Meias';
}

export interface GymRule {
  id: string;
  title: string;
  blurb: string;
  icon: string;
  highlight?: boolean;
}

export interface GymPlan {
  id: string;
  name: string;
  price?: number;
  period: string;
  icon: string;
  features: string[];
  badge?: string;
  badgeLabel?: string;
  badgeItems?: string[];
  cta?: string;
  highlight?: boolean;
}

export const GYM_NAME = 'Academia Stilus';

export const GYM_ADDRESS = {
  street: 'R. Pitágoras, 446',
  district: 'Teotônio Vilela, Ilhéus - BA',
  cep: '45657-150, Brasil',
  full: 'R. Pitágoras, 446 - Teotônio Vilela, Ilhéus - BA, 45657-150, Brasil',
};

export const GYM_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  GYM_ADDRESS.full
)}`;

export const GYM_INSTAGRAM_URL = 'https://www.instagram.com/academia_stilus/';

export const GYM_COORDS = {
  lat: -14.8063028,
  lng: -39.0588889,
};

export const TEACHER_COUNT = 19;

export const COURSE_TEACHER = 'Carlos Ribeiro';

export const COURSE_TEACHER_PHOTO = 'assets/carlos-ribeiro.webp';

export const MODALITIES: Modality[] = [
  {
    id: 'treinamento-funcional',
    name: 'Treinamento Funcional',
    kicker: 'Força · Equilíbrio · Mobilidade',
    blurb:
      'Movimentos naturais do dia a dia combinados com força e estabilidade. Um treino completo que melhora postura, coordenação e condicionamento — ideal para qualquer nível, do iniciante ao avançado.',
    icon: 'ph-person-simple-run',
    image: 'assets/modalidades/modalidade-funcional.webp',
    teacher: 'assets/modalidades/prof-funcional.webp',
  },
  {
    id: 'hitdance',
    name: 'Aula de HitDance',
    kicker: 'Cardio · Dança · Alta intensidade',
    blurb:
      'Coreografias de alta intensidade ao som de muita música. Queime calorias, solte o corpo e fortaleça o coração em uma aula cheia de energia, onde a diversão é tão importante quanto o esforço.',
    icon: 'ph-heartbeat',
    image: 'assets/modalidades/modalidade-hitdance.webp',
    teacher: 'assets/modalidades/prof-hitdance.webp',
    dim: true,
  },
  {
    id: 'fitdance',
    name: 'Aula de FitDance',
    kicker: 'Dança · Ritmo · Diversão',
    blurb:
      'A música guia cada movimento. Aulas animadas que trabalham o corpo inteiro enquanto você se diverte — sem coreografia complicada, no seu próprio ritmo e com acompanhamento de perto.',
    icon: 'ph-music-notes',
    image: 'assets/modalidades/modalidade-fitdance.webp',
    teacher: 'assets/modalidades/prof-fitdance.webp',
  },
  {
    id: 'crossfit',
    name: 'CrossFit',
    kicker: 'Força · Agilidade · Condicionamento',
    blurb:
      'Treinos de alta intensidade baseados nos exercícios do CrossFit. WODs que combinam levantamento, ginástica e cardio para construir força, condicionamento e superação em cada treino.',
    icon: 'ph-lightning',
    image: 'assets/modalidades/modalidade-crossfit.webp',
    teacher: 'assets/modalidades/prof-crossfit.webp',
  },
  {
    id: 'clube-ciclismo',
    name: 'Clube de Ciclismo',
    kicker: 'Resistência · Força · Grupo',
    blurb:
      'Pedaladas em grupo para ganhar resistência e força nas pernas. Treinos guiados com intensidade variada, onde ninguém fica para trás e a motivação vem de pedalar junto.',
    icon: 'ph-bicycle',
    image: 'assets/modalidades/modalidade-ciclismo.webp',
  },
  {
    id: 'aulas-coletivas',
    name: 'Aulas Coletivas',
    kicker: 'Turma · Acompanhamento · Constância',
    blurb:
      'Treine em turmas com acompanhamento próximo do professor. A energia do grupo mantém a constância e cada aula é uma chance de evoluir junto com quem também quer resultado.',
    icon: 'ph-users-three',
    image: 'assets/modalidades/modalidade-coletivas.webp',
  },
];

export const COURSES: Course[] = [
  {
    id: 'personal-trainer',
    name: 'Personal Trainer',
    blurb: 'O curso aborda o tema de Personal Trainer, focado no acompanhamento de treinos.',
    icon: 'ph-chalkboard-teacher',
  },
  {
    id: 'anamnese-clinica',
    name: 'Anamnese Clínica',
    blurb: 'O curso aborda o tema de Anamnese Clínica, focado na avaliação dos alunos.',
    icon: 'ph-stethoscope',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'camisa-stilus',
    name: 'Camisa Stilus',
    blurb: 'Camisa oficial da Academia Stilus.',
    price: 89.9,
    image: 'assets/camisa-1.webp',
    category: 'Camisas',
  },
  {
    id: 'camisa-stilus-fit',
    name: 'Camisa Stilus Fit',
    blurb: 'Camisa esportiva da Academia Stilus.',
    price: 89.9,
    image: 'assets/camisa-2.webp',
    category: 'Camisas',
  },
  {
    id: 'meia-stilus',
    name: 'Meia Stilus',
    blurb: 'Meia oficial da Academia Stilus.',
    price: 29.9,
    image: 'assets/meia-1.webp',
    category: 'Meias',
  },
  {
    id: 'meia-stilus-fit',
    name: 'Meia Stilus Fit',
    blurb: 'Meia esportiva da Academia Stilus.',
    price: 29.9,
    image: 'assets/meia-2.webp',
    category: 'Meias',
  },
];

export const RULES: GymRule[] = [
  {
    id: 'pesos',
    title: 'Guardar os pesos após o uso',
    blurb: 'Devolva os pesos no lugar depois do treino.',
    icon: 'ph-barbell',
  },
  {
    id: 'higiene',
    title: 'Higienizar os aparelhos',
    blurb: 'Limpe os aparelhos após o uso.',
    icon: 'ph-drop',
  },
  {
    id: 'horarios',
    title: 'Respeitar os horários de abertura e fechamento',
    blurb: 'Respeite os horários da academia.',
    icon: 'ph-clock',
  },
  {
    id: 'sapato',
    title: 'É obrigatório o uso de sapato',
    blurb: 'O uso de sapato é obrigatório.',
    icon: 'ph-footprints',
  },
  {
    id: 'celular',
    title: 'Evitar o uso de celular',
    blurb: 'Evite o uso do celular durante o treino.',
    icon: 'ph-device-mobile',
  },
  {
    id: 'respeito',
    title: 'Respeitar os outros',
    blurb: 'Respeito dentro e fora dos aparelhos.',
    icon: 'ph-handshake',
    highlight: true,
  },
];

export const NAV_LINKS = [
  { label: 'A Academia', href: '#academia' },
  { label: 'Modalidades', href: '#modalidades' },
  { label: 'Planos', href: '#planos' },
  { label: 'Produtos', href: '#produtos' },
  { label: 'Regras', href: '#regras' },
  { label: 'Localização', href: '#localizacao' },
];

export const PLANS: GymPlan[] = [
  {
    id: 'diaria',
    name: 'Diária',
    price: 15,
    period: 'por dia',
    icon: 'ph-ticket',
    features: [
      'Treino liberado por 1 dia',
      'Acesso a todas as modalidades',
      'Sem fidelidade',
    ],
  },
  {
    id: 'mensal',
    name: 'Mensal',
    price: 140,
    period: 'por mês',
    icon: 'ph-calendar-check',
    features: [
      'Treino liberado por 30 dias',
      'Todas as modalidades',
      'Acompanhamento dos professores',
      'Horários livres',
    ],
    highlight: true,
  },
  {
    id: 'gympass',
    name: 'Gympass',
    badgeLabel: 'Aceitamos:',
    badgeItems: ['Wellhub (Gympass)', 'Total Pass'],
    period: 'Seu benefício vale aqui',
    icon: 'ph-credit-card',
    features: [
      'Aceita o plano Basic+ e demais',
      'Aceita Total Pass',
      'Todas as modalidades',
      'Acompanhamento dos professores',
    ],
    cta: 'Tenho Gympass ou Total Pass',
  },
];

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
