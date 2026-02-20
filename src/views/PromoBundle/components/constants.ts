type Bundle = {
  id: string;
  name: string;
  priceRsd: number;
  description: string;
  popular?: boolean;
  features: {
    productDays: number;
    numProducts: number;
    shopDays: number;
    capacityPlaces: number;
  };
};

export const BUNDLES: Array<Bundle> = [
  {
    id: 'BASIC',
    name: 'Osnovni Paket',
    priceRsd: 5250,
    description: 'Idealno za početak',
    features: {
      productDays: 7,
      numProducts: 5,
      shopDays: 7,
      capacityPlaces: 25
    }
  },
  {
    id: 'STANDARD',
    name: 'Standardni Paket',
    priceRsd: 12320,
    description: 'Najpopularniji izbor',
    popular: true,
    features: {
      productDays: 14,
      numProducts: 10,
      shopDays: 14,
      capacityPlaces: 50
    }
  },
  {
    id: 'PREMIUM',
    name: 'Premium Paket',
    priceRsd: 31360,
    description: 'Maksimalna vidljivost',
    features: {
      productDays: 28,
      numProducts: 20,
      shopDays: 25,
      capacityPlaces: 100
    }
  }
];
