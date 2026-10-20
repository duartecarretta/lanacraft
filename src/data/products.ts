export type Variant = {
    id: string;
    label: string;
    priceEUR: number;
};

export type Product = {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    basePriceEUR: number;
    images: string[];
    variants: Variant[];
    requiresPhoto: boolean;
    madeToOrder: boolean;
    leadTime?: string;
    placeholder?: boolean; // true = sample/demo image, swap for real photos later
};

export const products: Product[] = [
  {
        slug: "bordado-cactus-desierto",
        name: "Bordado Cactus del Desierto",
        tagline: "Fieltro de aguja sobre lino, enmarcado a mano",
        description:
                "Una pieza original hecha con la técnica de needle felting (fieltro de aguja) sobre lino natural. El sol cálido y el cactus verde crean una escena sencilla y acogedora, perfecta para dar calidez a cualquier rincón de la casa.",
        basePriceEUR: 32,
        images: [
                "/products/cactus-3.jpg",
                "/products/cactus-1.jpg",
                "/products/cactus-2.jpg",
                "/products/cactus-6.jpg",
              ],
        variants: [
          { id: "pequeno", label: "Marco pequeño (13x18 cm)", priceEUR: 32 },
          { id: "grande", label: "Marco grande (21x30 cm)", priceEUR: 45 },
              ],
        requiresPhoto: false,
        madeToOrder: true,
        leadTime: "1 a 2 semanas",
  },
  {
        slug: "retrato-mascota-fieltro",
        name: "Retrato de Mascota en Fieltro",
        tagline: "Tu mascota, hecha a mano con cariño",
        description:
                "Un retrato único de tu mascota hecho con la técnica de needle felting, a partir de las fotos que nos envíes. Cada pieza es cuidadosamente elaborada a mano, capturando el carácter y los colores de tu compañero peludo.",
        basePriceEUR: 55,
        images: ["/products/placeholder-pet.svg"],
        variants: [
          { id: "1-mascota", label: "1 mascota", priceEUR: 55 },
          { id: "2-mascotas", label: "2 mascotas", priceEUR: 85 },
              ],
        requiresPhoto: true,
        madeToOrder: true,
        leadTime: "2 a 4 semanas",
        placeholder: true,
  },
  {
        slug: "retrato-familiar-fieltro",
        name: "Retrato Familiar en Fieltro",
        tagline: "Un recuerdo hecho a mano para toda la familia",
        description:
                "Inmortaliza a tu familia, pareja o amigos en una pieza textil hecha a mano. Ideal como regalo para bodas, aniversarios o simplemente para decorar el hogar con un toque personal.",
        basePriceEUR: 65,
        images: ["/products/placeholder-family.svg"],
        variants: [
          { id: "2-personas", label: "2 personas", priceEUR: 65 },
          { id: "3-4-personas", label: "3 a 4 personas", priceEUR: 95 },
              ],
        requiresPhoto: true,
        madeToOrder: true,
        leadTime: "3 a 5 semanas",
        placeholder: true,
  },
  {
        slug: "patron-digital-otono",
        name: "Patrón Digital Otoño Mágico",
        tagline: "Descarga en PDF para tus propios proyectos",
        description:
                "Un patrón digital en PDF con instrucciones paso a paso para crear tu propia pieza de fieltro de aguja inspirada en el otoño. Perfecto para quienes quieren empezar en el mundo del needle felting.",
        basePriceEUR: 9,
        images: ["/products/placeholder-pattern.svg"],
        variants: [{ id: "digital", label: "Descarga digital (PDF)", priceEUR: 9 }],
        requiresPhoto: false,
        madeToOrder: false,
        placeholder: true,
  },
  ];

export function getProduct(slug: string) {
    return products.find((p) => p.slug === slug);
}
