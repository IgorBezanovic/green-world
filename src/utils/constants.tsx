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
    text: 'Cvetni asortiman'
  },
  {
    id: 2,
    image: "url('/evergreen_seedlings-min.jpg')",
    route: '/search',
    text: 'Zimzelene sadnice'
  },
  {
    id: 3,
    image: "url('/potted_flowers-min.jpg')",
    route: '/search',
    text: 'Saksijsko cvece'
  },
  {
    id: 4,
    image: "url('/seedlings-min.jpg')",
    route: '/search',
    text: 'Sadnice'
  },
  {
    id: 5,
    image: "url('/fruits_and_vege-min.jpg')",
    route: '/search',
    text: 'Voce i povrce'
  },
  {
    id: 6,
    image: "url('/pharmacy-min.jpg')",
    route: '/search',
    text: 'Biljna apoteka'
  },
  {
    id: 7,
    image: "url('/garden_decoration-min.jpg')",
    route: '/search',
    text: 'Bastenska dekoracija'
  },
  {
    id: 8,
    image: "url('/all_for_plants-min.jpg')",
    route: '/search',
    text: 'Sve za biljke'
  }
];
