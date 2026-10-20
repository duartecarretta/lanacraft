import type { Localized } from "@/lib/i18n";

export type Variant = {
  id: string;
  label: Localized;
  priceEUR: number;
};

export type Product = {
  slug: string;
  name: Localized;
  tagline: Localized;
  description: Localized;
  basePriceEUR: number;
  images: string[];
  variants: Variant[];
  requiresPhoto: boolean;
  madeToOrder: boolean;
  leadTime?: Localized;
  placeholder?: boolean; // true = sample/demo image, swap for real photos later
};

export const products: Product[] = [
  {
    slug: "bordado-cactus-desierto",
    name: {
      es: "Bordado Cactus del Desierto",
      en: "Desert Cactus Embroidery",
      pt: "Bordado Cacto do Deserto",
    },
    tagline: {
      es: "Fieltro de aguja sobre lino, enmarcado a mano",
      en: "Needle felting on linen, hand-framed",
      pt: "Feltro de agulha sobre linho, emoldurado à mão",
    },
    description: {
      es: "Una pieza original hecha con la técnica de needle felting (fieltro de aguja) sobre lino natural. El sol cálido y el cactus verde crean una escena sencilla y acogedora, perfecta para dar calidez a cualquier rincón de la casa.",
      en: "An original piece made with the needle felting technique on natural linen. The warm sun and green cactus create a simple, cozy scene, perfect for adding warmth to any corner of your home.",
      pt: "Uma peça original feita com a técnica de feltro de agulha (needle felting) sobre linho natural. O sol quente e o cacto verde criam uma cena simples e acolhedora, perfeita para dar um toque de calor a qualquer canto da casa.",
    },
    basePriceEUR: 32,
    images: [
      "/products/cactus-3.jpg",
      "/products/cactus-1.jpg",
      "/products/cactus-2.jpg",
      "/products/cactus-6.jpg",
    ],
    variants: [
      {
        id: "pequeno",
        label: {
          es: "Marco pequeño (13x18 cm)",
          en: "Small frame (13x18 cm)",
          pt: "Moldura pequena (13x18 cm)",
        },
        priceEUR: 32,
      },
      {
        id: "grande",
        label: {
          es: "Marco grande (21x30 cm)",
          en: "Large frame (21x30 cm)",
          pt: "Moldura grande (21x30 cm)",
        },
        priceEUR: 45,
      },
    ],
    requiresPhoto: false,
    madeToOrder: true,
    leadTime: { es: "1 a 2 semanas", en: "1 to 2 weeks", pt: "1 a 2 semanas" },
  },
  {
    slug: "retrato-mascota-fieltro",
    name: {
      es: "Retrato de Mascota en Fieltro",
      en: "Felted Pet Portrait",
      pt: "Retrato de Pet em Feltro",
    },
    tagline: {
      es: "Tu mascota, hecha a mano con cariño",
      en: "Your pet, handmade with love",
      pt: "Seu bichinho, feito à mão com carinho",
    },
    description: {
      es: "Un retrato único de tu mascota hecho con la técnica de needle felting, a partir de las fotos que nos envíes. Cada pieza es cuidadosamente elaborada a mano, capturando el carácter y los colores de tu compañero peludo.",
      en: "A unique portrait of your pet made with the needle felting technique, based on the photos you send us. Each piece is carefully handcrafted, capturing the character and colors of your furry companion.",
      pt: "Um retrato único do seu animal de estimação feito com a técnica de feltro de agulha, a partir das fotos que você nos enviar. Cada peça é cuidadosamente feita à mão, capturando o caráter e as cores do seu companheiro peludo.",
    },
    basePriceEUR: 55,
    images: ["/products/placeholder-pet.svg"],
    variants: [
      {
        id: "1-mascota",
        label: { es: "1 mascota", en: "1 pet", pt: "1 bichinho" },
        priceEUR: 55,
      },
      {
        id: "2-mascotas",
        label: { es: "2 mascotas", en: "2 pets", pt: "2 bichinhos" },
        priceEUR: 85,
      },
    ],
    requiresPhoto: true,
    madeToOrder: true,
    leadTime: { es: "2 a 4 semanas", en: "2 to 4 weeks", pt: "2 a 4 semanas" },
    placeholder: true,
  },
  {
    slug: "retrato-familiar-fieltro",
    name: {
      es: "Retrato Familiar en Fieltro",
      en: "Felted Family Portrait",
      pt: "Retrato Familiar em Feltro",
    },
    tagline: {
      es: "Un recuerdo hecho a mano para toda la familia",
      en: "A handmade keepsake for the whole family",
      pt: "Uma lembrança feita à mão para toda a família",
    },
    description: {
      es: "Inmortaliza a tu familia, pareja o amigos en una pieza textil hecha a mano. Ideal como regalo para bodas, aniversarios o simplemente para decorar el hogar con un toque personal.",
      en: "Immortalize your family, partner or friends in a handmade textile piece. Perfect as a gift for weddings, anniversaries, or simply to decorate your home with a personal touch.",
      pt: "Eternize sua família, parceiro(a) ou amigos em uma peça têxtil feita à mão. Ideal como presente para casamentos, aniversários ou simplesmente para decorar a casa com um toque pessoal.",
    },
    basePriceEUR: 65,
    images: ["/products/placeholder-family.svg"],
    variants: [
      {
        id: "2-personas",
        label: { es: "2 personas", en: "2 people", pt: "2 pessoas" },
        priceEUR: 65,
      },
      {
        id: "3-4-personas",
        label: { es: "3 a 4 personas", en: "3 to 4 people", pt: "3 a 4 pessoas" },
        priceEUR: 95,
      },
    ],
    requiresPhoto: true,
    madeToOrder: true,
    leadTime: { es: "3 a 5 semanas", en: "3 to 5 weeks", pt: "3 a 5 semanas" },
    placeholder: true,
  },
  {
    slug: "patron-digital-otono",
    name: {
      es: "Patrón Digital Otoño Mágico",
      en: "Magical Autumn Digital Pattern",
      pt: "Padrão Digital Outono Mágico",
    },
    tagline: {
      es: "Descarga en PDF para tus propios proyectos",
      en: "PDF download for your own projects",
      pt: "Download em PDF para seus próprios projetos",
    },
    description: {
      es: "Un patrón digital en PDF con instrucciones paso a paso para crear tu propia pieza de fieltro de aguja inspirada en el otoño. Perfecto para quienes quieren empezar en el mundo del needle felting.",
      en: "A digital PDF pattern with step-by-step instructions to create your own needle-felted piece inspired by autumn. Perfect for anyone wanting to start out in the world of needle felting.",
      pt: "Um padrão digital em PDF com instruções passo a passo para criar sua própria peça de feltro de agulha inspirada no outono. Perfeito para quem quer começar no mundo do needle felting.",
    },
    basePriceEUR: 9,
    images: ["/products/placeholder-pattern.svg"],
    variants: [
      {
        id: "digital",
        label: {
          es: "Descarga digital (PDF)",
          en: "Digital download (PDF)",
          pt: "Download digital (PDF)",
        },
        priceEUR: 9,
      },
    ],
    requiresPhoto: false,
    madeToOrder: false,
    placeholder: true,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
