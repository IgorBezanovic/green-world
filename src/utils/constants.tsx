import ContactsOutlined from '@ant-design/icons/lib/icons/ContactsOutlined';
import MailOutlined from '@ant-design/icons/lib/icons/MailOutlined';
import NumberOutlined from '@ant-design/icons/lib/icons/NumberOutlined';
import PhoneOutlined from '@ant-design/icons/lib/icons/PhoneOutlined';
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';

export const navigationItems = [
  {
    id: 1,
    title: 'Dodaj oglas',
    route: '/dodaj-oglas'
  },
  {
    id: 2,
    title: UserOutlined,
    route: '/login'
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
    image: "url('/cvece.jpg')",
    route: '/search',
    text: 'Cvetni asortiman'
  },
  {
    id: 2,
    image: "url('/sadnica.jpg')",
    route: '/search',
    text: 'Sadnice'
  },
  {
    id: 3,
    image: "url('/voce_i_povrce.jpg')",
    route: '/search',
    text: 'Voce i povrce'
  },
  {
    id: 4,
    image: "url('/poljo_apoteka.jpg')",
    route: '/search',
    text: 'Biljna apoteka'
  },
  {
    id: 5,
    image: "url('/zimzelene_sadnice.jpg')",
    route: '/search',
    text: 'Zimzelene sadnice'
  },
  {
    id: 6,
    image: "url('/saksisko_cvece.jpg')",
    route: '/search',
    text: 'Saksijsko cvece'
  },
  {
    id: 7,
    image: "url('/bastenska_dekoracija.jpg')",
    route: '/search',
    text: 'Bastenska dekoracija'
  },
  {
    id: 8,
    image: "url('/sve_za_biljke.jpg')",
    route: '/search',
    text: 'Sve za biljke'
  }
];
