import ContactsOutlined from '@ant-design/icons/lib/icons/ContactsOutlined';
import MailOutlined from '@ant-design/icons/lib/icons/MailOutlined';
import NumberOutlined from '@ant-design/icons/lib/icons/NumberOutlined';
import PhoneOutlined from '@ant-design/icons/lib/icons/PhoneOutlined';
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';

export const navigationItems = [
  {
    id: 1,
    slug: 'ad',
    title: 'Dodaj oglas',
    route: '/dodaj-oglas',
    loggedRoute: '/dodaj-oglas'
  },
  {
    id: 2,
    slug: 'user',
    title: UserOutlined,
    route: '/login',
    loggedRoute: '/profile'
  }
];

export const userDetails = [
  {
    id: 1,
    property: 'id',
    icon: NumberOutlined
  },
  {
    id: 2,
    property: 'name',
    icon: UserOutlined
  },
  {
    id: 3,
    property: 'username',
    icon: ContactsOutlined
  },
  {
    id: 4,
    property: 'email',
    icon: MailOutlined
  },
  {
    id: 5,
    property: 'phone',
    icon: PhoneOutlined
  }
];

export const legalType = [
  {
    id: 1,
    name: 'Cvecara',
    slug: 'cvecara'
  },
  {
    id: 2,
    name: 'Rasadnik',
    slug: 'rasadnik'
  },
  {
    id: 3,
    name: 'Poljoprivredna apoteka',
    slug: 'poljoprivrednaApoteka'
  }
];

export const homeCategories = [
  {
    id: 1,
    image: "url('/bouqeut_of_flowers-min.jpg')",
    route: '/search',
    text: 'Cvetni asortiman',
    slug: 'flower_assortment'
  },
  {
    id: 2,
    image: "url('/evergreen_seedlings-min.jpg')",
    route: '/search',
    text: 'Sukulenti',
    slug: 'succulents'
  },
  {
    id: 3,
    image: "url('/potted_flowers-min.jpg')",
    route: '/search',
    text: 'Saksijsko cvece',
    slug: 'potted_flowers'
  },
  {
    id: 4,
    image: "url('/seedlings-min.jpg')",
    route: '/search',
    text: 'Sadnice',
    slug: 'seedlings'
  },
  {
    id: 5,
    image: "url('/fruits_and_vege-min.jpg')",
    route: '/search',
    text: 'Voce i povrce',
    slug: 'fruits_and_vegetables'
  },
  {
    id: 6,
    image: "url('/pharmacy-min.jpg')",
    route: '/search',
    text: 'Biljna apoteka',
    slug: 'herbal_pharmacy'
  },
  {
    id: 7,
    image: "url('/garden_decoration-min.jpg')",
    route: '/search',
    text: 'Bastenska dekoracija',
    slug: 'garden_decoration'
  },
  {
    id: 8,
    image: "url('/all_for_plants-min.jpg')",
    route: '/search',
    text: 'Sve za biljke',
    slug: 'everything_for_plants'
  }
];

export const mainGroups = [
  'flower_assortment',
  'succulents',
  'potted_flowers',
  'seedlings',
  'fruits_and_vegetables',
  'herbal_pharmacy',
  'garden_decoration',
  'everything_for_plants'
] as const;
