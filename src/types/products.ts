import { env } from '../config/env.js';

export interface ProductConfig {
  name: string;
  priceId: string;
  description: string;
}

const productCatalog: Record<string, ProductConfig> = {
  'soarele-stralucirea-ta': {
    name: 'Soarele Stralucirea Ta',
    priceId: env.STRIPE_SOARELE_STRALUCIREA_TA,
    description: 'Soarele Stralucirea Ta',
  },
  'ghid-saturn-in-berbec': {
    name: 'Ghid Saturn in Berbec',
    priceId: env.STRIPE_GHID_SATURN_IN_BERBEC,
    description: 'Ghid complet Saturn in Berbec',
  },
  'astrograma-natala-si-karmica': {
    name: 'Astrograma Natala si Karmica',
    priceId: env.STRIPE_ASTROGRAMA_NATALA_SI_KARMICA,
    description: 'Astrograma natala si karmica',
  },
  'astrograma-relationala': {
    name: 'Astrograma Relationala',
    priceId: env.STRIPE_ASTROGRAMA_RELATIONALA,
    description: 'Astrograma relationala',
  },
  'astrograma-previzionala': {
    name: 'Astrograma Previzionala',
    priceId: env.STRIPE_ASTROGRAMA_PREVIZIONALA,
    description: 'Astrograma previzionala',
  },
};

export { productCatalog };

export function getProduct(productKey: string): ProductConfig | undefined {
  return productCatalog[productKey];
}

export function getAvailableProducts(): string[] {
  return Object.keys(productCatalog);
}
