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
    name: 'promoBundleView.bundles.basic.name',
    priceRsd: 5250,
    description: 'promoBundleView.bundles.basic.desc',
    features: {
      productDays: 7,
      numProducts: 5,
      shopDays: 7,
      capacityPlaces: 25
    }
  },
  {
    id: 'STANDARD',
    name: 'promoBundleView.bundles.standard.name',
    priceRsd: 12320,
    description: 'promoBundleView.bundles.standard.desc',
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
    name: 'promoBundleView.bundles.premium.name',
    priceRsd: 31360,
    description: 'promoBundleView.bundles.premium.desc',
    features: {
      productDays: 28,
      numProducts: 20,
      shopDays: 25,
      capacityPlaces: 100
    }
  }
];
