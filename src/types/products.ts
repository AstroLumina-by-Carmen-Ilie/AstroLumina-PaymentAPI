import { env } from '../config/env.js';

export interface ProductConfig {
  name: string;
  priceId: string;
  description: string;
}

const productCatalog: Record<string, ProductConfig> = {
  booking: {
    name: 'Consultatie Astrologica',
    priceId: env.STRIPE_BOOKING_PRICE,
    description: 'Programare consultatie astrologica personalizata',
  },
  'natal-chart': {
    name: 'Harta Natala',
    priceId: env.STRIPE_NATAL_CHART_PRICE,
    description: 'Raport complet harta natala cu interpretare',
  },
  'karmic-chart': {
    name: 'Harta Karmica',
    priceId: env.STRIPE_KARMIC_CHART_PRICE,
    description: 'Raport harta karmica cu lectii de viata',
  },
};

if (env.STRIPE_RELATIONSHIP_CHART_PRICE) {
  productCatalog['relationship-chart'] = {
    name: 'Relatie Sinastrie',
    priceId: env.STRIPE_RELATIONSHIP_CHART_PRICE,
    description: 'Raport compatibilitate relationala',
  };
}

if (env.STRIPE_TRANSIT_CHART_PRICE) {
  productCatalog['transit-chart'] = {
    name: 'Tranzite',
    priceId: env.STRIPE_TRANSIT_CHART_PRICE,
    description: 'Raport tranzite planetare curente',
  };
}

export { productCatalog };

export function getProduct(productKey: string): ProductConfig | undefined {
  return productCatalog[productKey];
}

export function getAvailableProducts(): string[] {
  return Object.keys(productCatalog);
}
