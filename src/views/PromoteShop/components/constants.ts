type ShopPackage = {
  id: string;
  name: string;
  days: number;
  priceRsd: number;
  description: string;
  popular?: boolean;
};

export const SHOP_PACKAGES: Array<ShopPackage> = [
  {
    id: '7',
    name: '7 dana',
    days: 7,
    priceRsd: 1500,
    description: 'Kratka promocija'
  },
  {
    id: '14',
    name: '14 dana',
    days: 14,
    priceRsd: 2600,
    description: 'Dve nedelje'
  },
  {
    id: '28',
    name: '28 dana',
    days: 28,
    priceRsd: 4800,
    description: 'Najpovoljnije po danu',
    popular: true
  }
];
