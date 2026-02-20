type CapacityPackage = {
  id: string;
  name: string;
  places: number;
  priceRsd: number;
  description: string;
  popular?: boolean;
};

export const CAPACITY_PACKAGES: Array<CapacityPackage> = [
  {
    id: '25',
    name: '25 mesta',
    places: 25,
    priceRsd: 3000,
    description: 'Za manje prodavnice'
  },
  {
    id: '50',
    name: '50 mesta',
    places: 50,
    priceRsd: 5000,
    description: 'Najpopularniji izbor',
    popular: true
  },
  {
    id: '100',
    name: '100 mesta',
    places: 100,
    priceRsd: 8000,
    description: 'Najpovoljnije po mestu'
  }
];
