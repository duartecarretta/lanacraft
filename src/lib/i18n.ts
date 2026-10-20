export type Locale = "es" | "en" | "pt";

export const LOCALES: Locale[] = ["es", "en", "pt"];
export const DEFAULT_LOCALE: Locale = "es";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LANGUAGE_NAMES: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
};

export type Localized = {
  es: string;
  en: string;
  pt: string;
};

export function emptyLocalized(): Localized {
  return { es: "", en: "", pt: "" };
}

/**
 * Reads a localized value for the given locale, falling back through the
 * other languages (and tolerating a plain string, for older data) so the
 * site never renders a blank field just because a translation is missing.
 */
export function localize(
  value: Localized | string | undefined | null,
  locale: Locale
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[locale] || value.es || value.en || value.pt || "";
}

/**
 * Normalizes a value coming from storage (which may be an older plain
 * string, a partial object, or already a full Localized object) into a
 * complete Localized object, using `fallback` for anything missing.
 */
export function toLocalized(value: unknown, fallback: Localized): Localized {
  if (typeof value === "string" && value.length > 0) {
    return { es: value, en: value, pt: value };
  }
  if (value && typeof value === "object") {
    const v = value as Partial<Localized>;
    const es = v.es || fallback.es;
    return {
      es,
      en: v.en || fallback.en || es,
      pt: v.pt || fallback.pt || es,
    };
  }
  return fallback;
}

type HomeDictionary = {
  badge: string;
  ctaShop: string;
  ctaAbout: string;
  collectionTitle: string;
  collectionSubtitle: string;
  from: string;
  testimonialsTitle: string;
  testimonials: { quote: string; author: string }[];
};

type Dictionary = {
  nav: { shop: string; about: string; contact: string; cart: string };
  home: HomeDictionary;
  shop: { title: string; subtitle: string; from: string };
  product: {
    back: string;
    sampleImage: string;
    option: string;
    photoLabel: string;
    file: string;
    notesPlaceholder: string;
    quantity: string;
    addToCart: string;
    added: string;
    madeToOrder: string;
  };
  cart: {
    title: string;
    empty: string;
    goToShop: string;
    remove: string;
    total: string;
    checkout: string;
    checkingOut: string;
    genericError: string;
    connectionError: string;
    secureNote: string;
  };
  contact: {
    title: string;
    subtitle: string;
    sent: string;
    name: string;
    email: string;
    message: string;
    photo: string;
    send: string;
    sending: string;
    genericError: string;
    connectionError: string;
  };
  success: { title: string; text: string; cta: string };
  footer: {
    linksTitle: string;
    contactTitle: string;
    madeWithLove: string;
    about: string;
    rights: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  es: {
    nav: { shop: "Tienda", about: "Sobre mí", contact: "Contacto", cart: "Carrito" },
    home: {
      badge: "Hecho a mano · España",
      ctaShop: "Ver la tienda",
      ctaAbout: "Conóceme",
      collectionTitle: "Descubre la colección",
      collectionSubtitle:
        "Cada pieza se hace a mano, por encargo, con todo el cuidado del mundo.",
      from: "Desde",
      testimonialsTitle: "Lo que dicen mis clientes",
      testimonials: [
        {
          quote:
            "Llegó el paquete y nos quedamos sin palabras. ¡Quedó precioso, se nota todo el cariño puesto en cada detalle!",
          author: "Carmen",
        },
        {
          quote:
            "Superó todas mis expectativas. El empaquetado también fue precioso. Gracias de corazón por tanta dedicación.",
          author: "Lucía",
        },
      ],
    },
    shop: {
      title: "Tienda",
      subtitle: "Piezas hechas a mano, por encargo. Envíos a toda España.",
      from: "Desde",
    },
    product: {
      back: "← Volver a la tienda",
      sampleImage: "Imagen de ejemplo",
      option: "Opción",
      photoLabel:
        "Sube una foto de referencia (opcional ahora, te la pediremos por email si prefieres)",
      file: "Archivo",
      notesPlaceholder:
        "Cuéntanos algo sobre tu mascota o la escena que imaginas (opcional)",
      quantity: "Cantidad",
      addToCart: "Añadir al carrito",
      added: "¡Añadido al carrito!",
      madeToOrder: "Pieza hecha a mano por encargo · Tiempo de elaboración:",
    },
    cart: {
      title: "Tu carrito",
      empty: "Tu carrito está vacío",
      goToShop: "Ir a la tienda",
      remove: "Eliminar",
      total: "Total",
      checkout: "Pagar con tarjeta",
      checkingOut: "Redirigiendo al pago…",
      genericError: "No se pudo iniciar el pago. Inténtalo de nuevo.",
      connectionError: "No se pudo conectar con el pago. Inténtalo de nuevo.",
      secureNote:
        "Pago seguro procesado por Stripe. Si enviaste una foto de referencia, te confirmaremos por email los próximos pasos.",
    },
    contact: {
      title: "Contacto",
      subtitle:
        "¿Tienes dudas sobre un pedido o quieres enviarnos una foto de tu mascota? Escríbenos aquí.",
      sent: "¡Mensaje enviado! Te responderemos lo antes posible 💛",
      name: "Nombre",
      email: "Email",
      message: "Mensaje",
      photo: "Adjuntar foto (opcional)",
      send: "Enviar mensaje",
      sending: "Enviando…",
      genericError: "No se pudo enviar el mensaje.",
      connectionError: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
    },
    success: {
      title: "¡Gracias por tu pedido! 🌵",
      text: "Hemos recibido tu pago correctamente. Te escribiremos por email en breve para confirmar los detalles y, si tu pedido lo necesita, para pedirte las fotos de referencia.",
      cta: "Seguir viendo la tienda",
    },
    footer: {
      linksTitle: "Enlaces",
      contactTitle: "Contacto",
      madeWithLove: "Hecho con amor en España",
      about:
        "Piezas de fieltro de aguja y bordado hechas a mano, con cariño, desde España.",
      rights: "Todos los derechos reservados.",
    },
  },
  en: {
    nav: { shop: "Shop", about: "About me", contact: "Contact", cart: "Cart" },
    home: {
      badge: "Handmade · Spain",
      ctaShop: "Visit the shop",
      ctaAbout: "Get to know me",
      collectionTitle: "Discover the collection",
      collectionSubtitle:
        "Every piece is handmade to order, with the utmost care.",
      from: "From",
      testimonialsTitle: "What my customers say",
      testimonials: [
        {
          quote:
            "The package arrived and we were speechless. It turned out beautiful, you can feel the love in every detail!",
          author: "Carmen",
        },
        {
          quote:
            "It exceeded all my expectations. The packaging was beautiful too. Thank you so much for all the care.",
          author: "Lucía",
        },
      ],
    },
    shop: {
      title: "Shop",
      subtitle: "Handmade pieces, made to order. Shipping all over Spain.",
      from: "From",
    },
    product: {
      back: "← Back to shop",
      sampleImage: "Sample image",
      option: "Option",
      photoLabel:
        "Upload a reference photo (optional for now, we'll ask by email if you prefer)",
      file: "File",
      notesPlaceholder:
        "Tell us about your pet or the scene you're picturing (optional)",
      quantity: "Quantity",
      addToCart: "Add to cart",
      added: "Added to cart!",
      madeToOrder: "Handmade to order · Production time:",
    },
    cart: {
      title: "Your cart",
      empty: "Your cart is empty",
      goToShop: "Go to shop",
      remove: "Remove",
      total: "Total",
      checkout: "Pay by card",
      checkingOut: "Redirecting to payment…",
      genericError: "Couldn't start the payment. Please try again.",
      connectionError: "Couldn't connect to payment. Please try again.",
      secureNote:
        "Secure payment processed by Stripe. If you sent a reference photo, we'll confirm the next steps by email.",
    },
    contact: {
      title: "Contact",
      subtitle:
        "Have questions about an order or want to send us a photo of your pet? Write to us here.",
      sent: "Message sent! We'll get back to you as soon as possible 💛",
      name: "Name",
      email: "Email",
      message: "Message",
      photo: "Attach photo (optional)",
      send: "Send message",
      sending: "Sending…",
      genericError: "Couldn't send the message.",
      connectionError: "Couldn't send the message. Please try again.",
    },
    success: {
      title: "Thank you for your order! 🌵",
      text: "We've received your payment successfully. We'll email you shortly to confirm the details and, if your order needs it, to ask for reference photos.",
      cta: "Keep browsing the shop",
    },
    footer: {
      linksTitle: "Links",
      contactTitle: "Contact",
      madeWithLove: "Made with love in Spain",
      about:
        "Handmade needle-felted and embroidered pieces, made with love, from Spain.",
      rights: "All rights reserved.",
    },
  },
  pt: {
    nav: { shop: "Loja", about: "Sobre mim", contact: "Contato", cart: "Carrinho" },
    home: {
      badge: "Feito à mão · Espanha",
      ctaShop: "Ver a loja",
      ctaAbout: "Me conheça",
      collectionTitle: "Descubra a coleção",
      collectionSubtitle:
        "Cada peça é feita à mão, sob encomenda, com todo o cuidado do mundo.",
      from: "A partir de",
      testimonialsTitle: "O que dizem minhas clientes",
      testimonials: [
        {
          quote:
            "O pacote chegou e ficamos sem palavras. Ficou lindo, dá pra sentir o carinho em cada detalhe!",
          author: "Carmen",
        },
        {
          quote:
            "Superou todas as minhas expectativas. A embalagem também ficou linda. Muito obrigada por tanta dedicação.",
          author: "Lucía",
        },
      ],
    },
    shop: {
      title: "Loja",
      subtitle: "Peças feitas à mão, sob encomenda. Entregamos para toda a Espanha.",
      from: "A partir de",
    },
    product: {
      back: "← Voltar para a loja",
      sampleImage: "Imagem de exemplo",
      option: "Opção",
      photoLabel:
        "Envie uma foto de referência (opcional por agora, pediremos por email se preferir)",
      file: "Arquivo",
      notesPlaceholder:
        "Conte algo sobre seu bichinho ou a cena que você imagina (opcional)",
      quantity: "Quantidade",
      addToCart: "Adicionar ao carrinho",
      added: "Adicionado ao carrinho!",
      madeToOrder: "Peça feita à mão sob encomenda · Tempo de produção:",
    },
    cart: {
      title: "Seu carrinho",
      empty: "Seu carrinho está vazio",
      goToShop: "Ir para a loja",
      remove: "Remover",
      total: "Total",
      checkout: "Pagar com cartão",
      checkingOut: "Redirecionando para o pagamento…",
      genericError: "Não foi possível iniciar o pagamento. Tente novamente.",
      connectionError: "Não foi possível conectar ao pagamento. Tente novamente.",
      secureNote:
        "Pagamento seguro processado pelo Stripe. Se você enviou uma foto de referência, confirmaremos os próximos passos por email.",
    },
    contact: {
      title: "Contato",
      subtitle:
        "Tem dúvidas sobre um pedido ou quer nos enviar uma foto do seu bichinho? Escreva para nós aqui.",
      sent: "Mensagem enviada! Responderemos o mais rápido possível 💛",
      name: "Nome",
      email: "Email",
      message: "Mensagem",
      photo: "Anexar foto (opcional)",
      send: "Enviar mensagem",
      sending: "Enviando…",
      genericError: "Não foi possível enviar a mensagem.",
      connectionError: "Não foi possível enviar a mensagem. Tente novamente.",
    },
    success: {
      title: "Obrigado pelo seu pedido! 🌵",
      text: "Recebemos seu pagamento com sucesso. Em breve enviaremos um email para confirmar os detalhes e, se o seu pedido precisar, para pedir as fotos de referência.",
      cta: "Continuar vendo a loja",
    },
    footer: {
      linksTitle: "Links",
      contactTitle: "Contato",
      madeWithLove: "Feito com amor na Espanha",
      about:
        "Peças de feltro de agulha e bordado feitas à mão, com carinho, desde a Espanha.",
      rights: "Todos os direitos reservados.",
    },
  },
};
