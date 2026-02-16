type Package = {
  id: string;
  name: string;
  days: number;
  pricePerProductRsd: number;
  description: string;
  popular: boolean;
};

export const PRODUCT_PACKAGES: Array<Package> = [
  {
    id: '7',
    name: '7 dana',
    days: 7,
    pricePerProductRsd: 600,
    description: 'Kratka promocija',
    popular: false
  },
  {
    id: '14',
    name: '14 dana',
    days: 14,
    pricePerProductRsd: 1000,
    description: 'Dve nedelje',
    popular: true
  },
  {
    id: '28',
    name: '28 dana',
    days: 28,
    pricePerProductRsd: 1600,
    description: 'Najpovoljnije po danu',
    popular: false
  }
];
