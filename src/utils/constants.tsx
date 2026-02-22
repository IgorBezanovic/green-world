import { LoginOutlined } from '@ant-design/icons';
import ContactsOutlined from '@ant-design/icons/lib/icons/ContactsOutlined';
import MailOutlined from '@ant-design/icons/lib/icons/MailOutlined';
import NumberOutlined from '@ant-design/icons/lib/icons/NumberOutlined';
import PhoneOutlined from '@ant-design/icons/lib/icons/PhoneOutlined';
import UserOutlined from '@ant-design/icons/lib/icons/UserOutlined';
import { HomeCategory, SubGroups } from '@green-world/utils/types';
import { ReactNode } from 'react';

export type GroupItemCreateProduct = {
  key: keyof SubGroups;
  label: string;
  icon: ReactNode;
};

export const navigationItems = [
  {
    id: 1,
    slug: 'ad',
    title: 'Dodaj oglas',
    route: '/create-ad',
    loggedRoute: '/create-ad'
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

export const homeCategories: HomeCategory[] = [
  {
    id: 1,
    image:
      'https://res.cloudinary.com/dijofqxeu/image/upload/v1756734375/rolkuumcojvnay4srdbl.webp',
    route: '/search/flower_assortment',
    text: 'Cvetni asortiman',
    slug: 'flower_assortment'
  },
  {
    id: 2,
    image:
      'https://res.cloudinary.com/dijofqxeu/image/upload/v1756734437/nwhuyfbqntll4chzwrys.webp',
    route: '/search/succulents',
    text: 'Sukulenti',
    slug: 'succulents'
  },
  {
    id: 3,
    image:
      'https://res.cloudinary.com/dijofqxeu/image/upload/v1756734487/dh61q6w6vhvufl2nqsju.webp',
    route: '/search/potted_flowers',
    text: 'Saksijsko cveće',
    slug: 'potted_flowers'
  },
  {
    id: 4,
    image:
      'https://res.cloudinary.com/dijofqxeu/image/upload/v1756734524/e2c7yyqu2wxmosyosfap.webp',
    route: '/search/seedlings',
    text: 'Sadnice',
    slug: 'seedlings'
  },
  {
    id: 5,
    image:
      'https://res.cloudinary.com/dijofqxeu/image/upload/v1756734567/qi6vrxr7ck98fdqqvb83.webp',
    route: '/search/fruits_and_vegetables',
    text: 'Voće i povrće',
    slug: 'fruits_and_vegetables'
  },
  {
    id: 6,
    image:
      'https://res.cloudinary.com/dijofqxeu/image/upload/v1756734608/qkv49cwxehh6osu3cfx4.webp',
    route: '/search/herbal_pharmacy',
    text: 'Biljna apoteka',
    slug: 'herbal_pharmacy'
  },
  {
    id: 7,
    image:
      'https://res.cloudinary.com/dijofqxeu/image/upload/v1756734642/jofstgnbcqqlpsnbt7pp.webp',
    route: '/search/garden_decoration',
    text: 'Baštenska dekoracija',
    slug: 'garden_decoration'
  },
  {
    id: 8,
    image:
      'https://res.cloudinary.com/dijofqxeu/image/upload/v1756734674/yc4pttb6sp02jmnjz9hh.webp',
    route: '/search/everything_for_plants',
    text: 'Sve za biljke',
    slug: 'everything_for_plants'
  }
];

export const categories = [
  'flower_assortment',
  'succulents',
  'potted_flowers',
  'seedlings',
  'fruits_and_vegetables',
  'herbal_pharmacy',
  'garden_decoration',
  'everything_for_plants'
];

export const subGroups: SubGroups = {
  flower_assortment: [
    { label: 'bouquets', sr_RS: 'Buketi' },
    { label: 'cut_flowers', sr_RS: 'Cveće za sečenje' },
    { label: 'floral_gifts', sr_RS: 'Cvetni pokloni' },
    { label: 'floral_arrangements', sr_RS: 'Cvetne aranžmane' },
    { label: 'preserved_flowers', sr_RS: 'Očuvano cveće' },
    { label: 'roses', sr_RS: 'Ruže' },
    { label: 'tulips', sr_RS: 'Tulipani' },
    { label: 'lilies', sr_RS: 'Ljiljani' },
    { label: 'orchids', sr_RS: 'Orhideje' },
    { label: 'daisies', sr_RS: 'Margarete' },
    { label: 'sunflowers', sr_RS: 'Suncokreti' },
    { label: 'carnations', sr_RS: 'Karanfili' },
    { label: 'peonies', sr_RS: 'Božuri' },
    { label: 'gerberas', sr_RS: 'Gerberi' },
    { label: 'hydrangeas', sr_RS: 'Hortenzije' },
    { label: 'anemones', sr_RS: 'Anemone' },
    { label: 'ranunculus', sr_RS: 'Ranunculus' },
    { label: 'chrysanthemums', sr_RS: 'Hrizanteme' },
    { label: 'delphiniums', sr_RS: 'Delphinijumi' },
    { label: 'snapdragons', sr_RS: 'Zmajeve usne' },
    { label: 'asters', sr_RS: 'Astre' },
    { label: 'zinnias', sr_RS: 'Cinije' },
    { label: 'cosmos', sr_RS: 'Kosmos' },
    { label: 'freesias', sr_RS: 'Frezije' },
    { label: 'lavender', sr_RS: 'Lavanda' },
    { label: 'lilacs', sr_RS: 'Jorgovani' },
    { label: 'iris', sr_RS: 'Peršun' },
    { label: 'calla_lilies', sr_RS: 'Kala ljiljani' },
    { label: 'stock', sr_RS: 'Stock' },
    { label: 'salvia', sr_RS: 'Salvija' },
    { label: 'pansies', sr_RS: 'Ljubičice' },
    { label: 'petunias', sr_RS: 'Petunije' },
    { label: 'corydalis', sr_RS: 'Koridal' },
    { label: 'bouvardia', sr_RS: 'Bouvardija' },
    { label: 'calendula', sr_RS: 'Neven' }
  ],
  succulents: [
    { label: 'indoor_succulents', sr_RS: 'Sobne sočne biljke' },
    { label: 'outdoor_succulents', sr_RS: 'Vanjske sočne biljke' },
    { label: 'cacti', sr_RS: 'Kaktusi' },
    { label: 'succulent_gifts', sr_RS: 'Pokloni sočnih biljaka' },
    { label: 'echeveria', sr_RS: 'Eševerija' },
    { label: 'haworthia', sr_RS: 'Havortija' },
    { label: 'aloe_vera', sr_RS: 'Aloe vera' },
    { label: 'jade_plant', sr_RS: 'Biljka žada' },
    { label: 'string_of_pearls', sr_RS: 'Niz bisera' },
    { label: 'burros_tail', sr_RS: 'Rep magarca' },
    { label: 'zebra_plant', sr_RS: 'Zebrasta biljka' },
    { label: 'panda_plant', sr_RS: 'Panda biljka' },
    { label: 'agave', sr_RS: 'Agava' },
    { label: 'sedum', sr_RS: 'Sedum' },
    { label: 'crassula', sr_RS: 'Krasula' },
    { label: 'kalanchoe', sr_RS: 'Kalanhoe' }
  ],
  potted_flowers: [
    { label: 'indoor_plants', sr_RS: 'Sobne biljke' },
    { label: 'outdoor_plants', sr_RS: 'Vanjske biljke' },
    { label: 'flowering_plants', sr_RS: 'Cvetne biljke' },
    { label: 'decorative_plants', sr_RS: 'Dekorativne biljke' },
    { label: 'peace_lily', sr_RS: 'Ljiljan mira' },
    { label: 'snake_plant', sr_RS: 'Zmijska biljka' },
    { label: 'spider_plant', sr_RS: 'Paučinska biljka' },
    { label: 'orchids', sr_RS: 'Orhideje' },
    { label: 'begonias', sr_RS: 'Begonije' },
    { label: 'fuchsias', sr_RS: 'Fuksije' },
    { label: 'african_violets', sr_RS: 'Afričke ljubičice' },
    { label: 'geraniums', sr_RS: 'Geranijumi' },
    { label: 'chrysanthemums', sr_RS: 'Hrizanteme' },
    { label: 'poinsettia', sr_RS: 'Božićna zvezda' },
    { label: 'anthurium', sr_RS: 'Anthurijum' },
    { label: 'calathea', sr_RS: 'Kalateja' },
    { label: 'ficus', sr_RS: 'Fikus' },
    { label: 'bromeliads', sr_RS: 'Bromelije' },
    { label: 'philodendron', sr_RS: 'Filodendron' },
    { label: 'string_of_hearts', sr_RS: 'Srce na koncu' },
    { label: 'jade_plant', sr_RS: 'Biljka jade' },
    { label: 'zz_plant', sr_RS: 'ZZ biljka' },
    { label: 'pothos', sr_RS: 'Pothos' },
    { label: 'dracaena', sr_RS: 'Dracena' },
    { label: 'areca_palm', sr_RS: 'Areka palma' },
    { label: 'rubber_plant', sr_RS: 'Gumena biljka' },
    { label: 'cast_iron_plant', sr_RS: 'Gvozdena biljka' },
    { label: 'money_plant', sr_RS: 'Biljka novca' },
    { label: 'maranta', sr_RS: 'Maranta' },
    { label: 'bamboo_plant', sr_RS: 'Bambus' },
    { label: 'coleus', sr_RS: 'Koleus' },
    { label: 'sansevieria', sr_RS: 'Sanseverija' },
    { label: 'hoya', sr_RS: 'Hoja' },
    { label: 'philodendron_birkin', sr_RS: 'Filodendron birkin' },
    { label: 'neoregalia', sr_RS: 'Neoregalia' }
  ],
  seedlings: [
    { label: 'flower_seedlings', sr_RS: 'Cvetne sadnice' },
    { label: 'vegetable_seedlings', sr_RS: 'Povrtne sadnice' },
    { label: 'fruit_seedlings', sr_RS: 'Voćne sadnice' },
    { label: 'herb_seedlings', sr_RS: 'Biljne sadnice' },
    { label: 'rose_seedlings', sr_RS: 'Sadnice ruža' },
    { label: 'lavender_seedlings', sr_RS: 'Sadnice lavande' },
    { label: 'sunflower_seedlings', sr_RS: 'Sadnice suncokreta' },
    { label: 'petunia_seedlings', sr_RS: 'Sadnice petunija' },
    { label: 'marigold_seedlings', sr_RS: 'Sadnice nevena' },
    { label: 'tomato_seedlings', sr_RS: 'Sadnice paradajza' },
    { label: 'pepper_seedlings', sr_RS: 'Sadnice paprike' },
    { label: 'cucumber_seedlings', sr_RS: 'Sadnice krastavaca' },
    { label: 'zucchini_seedlings', sr_RS: 'Sadnice tikvica' },
    { label: 'cabbage_seedlings', sr_RS: 'Sadnice kupusa' },
    { label: 'carrot_seedlings', sr_RS: 'Sadnice šargarepe' },
    { label: 'lettuce_seedlings', sr_RS: 'Sadnice salate' },
    { label: 'apple_seedlings', sr_RS: 'Sadnice jabuka' },
    { label: 'pear_seedlings', sr_RS: 'Sadnice krušaka' },
    { label: 'plum_seedlings', sr_RS: 'Sadnice šljiva' },
    { label: 'cherry_seedlings', sr_RS: 'Sadnice trešanja' },
    { label: 'peach_seedlings', sr_RS: 'Sadnice breskvi' },
    { label: 'quince_seedlings', sr_RS: 'Sadnice dunja' },
    { label: 'walnut_seedlings', sr_RS: 'Sadnice oraha' },
    { label: 'apricot_seedlings', sr_RS: 'Sadnice kajsija' },
    { label: 'basil_seedlings', sr_RS: 'Sadnice bosiljka' },
    { label: 'oregano_seedlings', sr_RS: 'Sadnice origana' },
    { label: 'thyme_seedlings', sr_RS: 'Sadnice majčine dušice' },
    { label: 'mint_seedlings', sr_RS: 'Sadnice mente' },
    { label: 'rosemary_seedlings', sr_RS: 'Sadnice ruzmarina' },
    { label: 'autohtona_sljiva_seedlings', sr_RS: 'Autohtone šljive' },
    { label: 'vranac_grape_seedlings', sr_RS: 'Sadnice grožđa vranac' },
    { label: 'dunja_seedlings', sr_RS: 'Sadnice dunje' },
    { label: 'lesnik_seedlings', sr_RS: 'Sadnice lešnika' },
    { label: 'malina_seedlings', sr_RS: 'Sadnice maline' },
    { label: 'kupina_seedlings', sr_RS: 'Sadnice kupine' },
    { label: 'šljiva_požegača_seedlings', sr_RS: 'Šljive požeške' },
    { label: 'prokupac_grape_seedlings', sr_RS: 'Sadnice grožđa prokupac' },
    { label: 'thuja_seedlings', sr_RS: 'Sadnice tuja' },
    { label: 'juniper_seedlings', sr_RS: 'Sadnice juna' },
    { label: 'cypress_seedlings', sr_RS: 'Sadnice cipresa' },
    { label: 'arborvitae_seedlings', sr_RS: 'Sadnice arborvitaea' },
    { label: 'pine_seedlings', sr_RS: 'Sadnice bora' },
    { label: 'spruce_seedlings', sr_RS: 'Sadnice smreke' },
    { label: 'fir_seedlings', sr_RS: 'Sadnice jele' }
  ],
  fruits_and_vegetables: [
    { label: 'fresh_fruits', sr_RS: 'Sveže voće' },
    { label: 'apples', sr_RS: 'Jabuke' },
    { label: 'pears', sr_RS: 'Kruške' },
    { label: 'plums', sr_RS: 'Šljive' },
    { label: 'cherries', sr_RS: 'Trešnje' },
    { label: 'peaches', sr_RS: 'Breskve' },
    { label: 'apricots', sr_RS: 'Kajsije' },
    { label: 'quince', sr_RS: 'Dunje' },
    { label: 'strawberries', sr_RS: 'Jagode' },
    { label: 'raspberries', sr_RS: 'Maline' },
    { label: 'blackberries', sr_RS: 'Kupine' },
    { label: 'blueberries', sr_RS: 'Borovnice' },
    { label: 'grapes', sr_RS: 'Grožđe' },
    { label: 'fresh_vegetables', sr_RS: 'Sveže povrće' },
    { label: 'tomatoes', sr_RS: 'Paradajz' },
    { label: 'peppers', sr_RS: 'Paprika' },
    { label: 'cucumbers', sr_RS: 'Krastavci' },
    { label: 'zucchini', sr_RS: 'Tikvice' },
    { label: 'cabbage', sr_RS: 'Kupus' },
    { label: 'carrots', sr_RS: 'Šargarepe' },
    { label: 'lettuce', sr_RS: 'Salata' },
    { label: 'onions', sr_RS: 'Luk' },
    { label: 'garlic', sr_RS: 'Beli luk' },
    { label: 'potatoes', sr_RS: 'Krompir' },
    { label: 'spinach', sr_RS: 'Spanać' },
    { label: 'eggplant', sr_RS: 'Patlidžan' },
    { label: 'organic_produce', sr_RS: 'Organski proizvodi' },
    { label: 'organic_apples', sr_RS: 'Organske jabuke' },
    { label: 'organic_tomatoes', sr_RS: 'Organski paradajzi' },
    { label: 'organic_peppers', sr_RS: 'Organska paprika' },
    { label: 'organic_cucumbers', sr_RS: 'Organski krastavci' },
    { label: 'organic_spinach', sr_RS: 'Organski spanać' },
    { label: 'organic_carrots', sr_RS: 'Organske šargarepe' },
    { label: 'seasonal_fruits', sr_RS: 'Sezonsko voće' },
    { label: 'šljiva_požegača', sr_RS: 'Šljive požeške' },
    { label: 'malina', sr_RS: 'Malina' },
    { label: 'kupina', sr_RS: 'Kupina' },
    { label: 'dunja', sr_RS: 'Dunja' },
    { label: 'prokupac_grapes', sr_RS: 'Grožđe prokupac' },
    { label: 'jagoda', sr_RS: 'Jagoda' },
    { label: 'šljiva_ranka', sr_RS: 'Šljive ranka' },
    { label: 'exotic_fruits', sr_RS: 'Egzotično voće' },
    { label: 'bananas', sr_RS: 'Banane' },
    { label: 'mangoes', sr_RS: 'Manga' },
    { label: 'kiwi', sr_RS: 'Kivi' },
    { label: 'pineapple', sr_RS: 'Ananas' },
    { label: 'papaya', sr_RS: 'Papaja' },
    { label: 'pomegranate', sr_RS: 'Nar' },
    { label: 'dragon_fruit', sr_RS: 'Zmajevo voće' },
    { label: 'lychee', sr_RS: 'Liči' },
    { label: 'flower_seedlings', sr_RS: 'Cvetne sadnice' },
    { label: 'sunflower_seedlings', sr_RS: 'Sadnice suncokreta' },
    { label: 'vegetable_seedlings', sr_RS: 'Povrtne sadnice' },
    { label: 'tomato_seedlings', sr_RS: 'Sadnice paradajza' },
    { label: 'pepper_seedlings', sr_RS: 'Sadnice paprike' },
    { label: 'cucumber_seedlings', sr_RS: 'Sadnice krastavaca' },
    { label: 'zucchini_seedlings', sr_RS: 'Sadnice tikvica' },
    { label: 'cabbage_seedlings', sr_RS: 'Sadnice kupusa' },
    { label: 'carrot_seedlings', sr_RS: 'Sadnice šargarepe' },
    { label: 'lettuce_seedlings', sr_RS: 'Sadnice salate' },
    { label: 'spinach_seedlings', sr_RS: 'Sadnice spanaća' },
    { label: 'eggplant_seedlings', sr_RS: 'Sadnice patlidžana' },
    { label: 'fruit_seedlings', sr_RS: 'Voćne sadnice' },
    { label: 'apple_seedlings', sr_RS: 'Sadnice jabuka' },
    { label: 'pear_seedlings', sr_RS: 'Sadnice krušaka' },
    { label: 'plum_seedlings', sr_RS: 'Sadnice šljiva' },
    { label: 'cherry_seedlings', sr_RS: 'Sadnice trešanja' },
    { label: 'peach_seedlings', sr_RS: 'Sadnice breskvi' },
    { label: 'quince_seedlings', sr_RS: 'Sadnice dunja' },
    { label: 'walnut_seedlings', sr_RS: 'Sadnice oraha' },
    { label: 'apricot_seedlings', sr_RS: 'Sadnice kajsija' },
    { label: 'grape_seedlings', sr_RS: 'Sadnice grožđa' },
    { label: 'herb_seedlings', sr_RS: 'Biljne sadnice' },
    { label: 'basil_seedlings', sr_RS: 'Sadnice bosiljka' },
    { label: 'oregano_seedlings', sr_RS: 'Sadnice origana' },
    { label: 'thyme_seedlings', sr_RS: 'Sadnice majčine dušice' },
    { label: 'mint_seedlings', sr_RS: 'Sadnice mente' },
    { label: 'rosemary_seedlings', sr_RS: 'Sadnice ruzmarina' },
    { label: 'autohtona_sljiva_seedlings', sr_RS: 'Autohtone šljive' },
    { label: 'vranac_grape_seedlings', sr_RS: 'Sadnice grožđa vranac' },
    { label: 'dunja_seedlings', sr_RS: 'Sadnice dunje' },
    { label: 'lesnik_seedlings', sr_RS: 'Sadnice lešnika' },
    { label: 'malina_seedlings', sr_RS: 'Sadnice maline' },
    { label: 'kupina_seedlings', sr_RS: 'Sadnice kupine' },
    { label: 'šljiva_požegača_seedlings', sr_RS: 'Šljive požeške' },
    { label: 'prokupac_grape_seedlings', sr_RS: 'Sadnice grožđa prokupac' }
  ],
  herbal_pharmacy: [
    { label: 'medicinal_herbs', sr_RS: 'Lekovito bilje' },
    { label: 'herbal_teas', sr_RS: 'Biljni čajevi' },
    { label: 'essential_oils', sr_RS: 'Eterična ulja' },
    { label: 'herbal_extracts', sr_RS: 'Biljni ekstrakti' },
    { label: 'plant_fertilizers', sr_RS: 'Đubriva za biljke' },
    { label: 'organic_fertilizers', sr_RS: 'Organska đubriva' },
    { label: 'compost', sr_RS: 'Kompost' },
    { label: 'liquid_plant_food', sr_RS: 'Tečna ishrana za biljke' },
    { label: 'soil_amendments', sr_RS: 'Poboljšivači tla' },
    { label: 'root_boosters', sr_RS: 'Pojačivači korena' },
    { label: 'growth_stimulants', sr_RS: 'Stimulansi rasta' },
    { label: 'natural_pesticides', sr_RS: 'Prirodni pesticidi' },
    { label: 'fungicides', sr_RS: 'Fungicidi' },
    { label: 'insect_repellents', sr_RS: 'Repelenti za insekte' },
    { label: 'plant_antibiotics', sr_RS: 'Biljni antibiotici' },
    { label: 'bio_protectants', sr_RS: 'Bio zaštitnici' },
    { label: 'plant_vitamins', sr_RS: 'Vitamini za biljke' },
    { label: 'mineral_supplements', sr_RS: 'Mineralni dodaci' },
    { label: 'herbal_tinctures', sr_RS: 'Biljne tinkture' },
    { label: 'herbal_balm', sr_RS: 'Biljna mast' },
    { label: 'herbal_syrups', sr_RS: 'Biljni sirupi' },
    { label: 'herbal_cough_remedies', sr_RS: 'Biljni lekovi za kašalj' },
    { label: 'digestive_aids', sr_RS: 'Probavni dodaci' }
  ],
  garden_decoration: [
    { label: 'garden_statues', sr_RS: 'Baštenske statue' },
    { label: 'outdoor_lighting', sr_RS: 'Spoljašnje osvetljenje' },
    { label: 'garden_furniture', sr_RS: 'Baštenski nameštaj' },
    { label: 'decorative_pots', sr_RS: 'Dekorativni saksije' },
    { label: 'water_features', sr_RS: 'Vodeni elementi' },
    { label: 'garden_gnomes', sr_RS: 'Baštenski patuljci' },
    { label: 'bird_baths', sr_RS: 'Kupke za ptice' },
    { label: 'birdhouses', sr_RS: 'Kućice za ptice' },
    { label: 'wind_chimes', sr_RS: 'Vetrotresi' },
    { label: 'garden_trellises', sr_RS: 'Baštenski rešetke' },
    { label: 'pergolas', sr_RS: 'Pergole' },
    { label: 'hanging_planters', sr_RS: 'Viseće saksije' },
    { label: 'garden_sculptures', sr_RS: 'Baštenske skulpture' },
    { label: 'garden_pathways', sr_RS: 'Baštenski staze' },
    { label: 'decorative_fencing', sr_RS: 'Dekorativni ograde' },
    { label: 'garden_benches', sr_RS: 'Baštenske klupe' },
    { label: 'garden_swing_seats', sr_RS: 'Ljuljaške za baštu' },
    { label: 'gazebos', sr_RS: 'Sjenice' },
    { label: 'fire_pits', sr_RS: 'Ognjišta' },
    { label: 'outdoor_rugs', sr_RS: 'Spoljašnji tepisi' },
    { label: 'stepping_stones', sr_RS: 'Staze od kamenčića' },
    { label: 'flower_beds_borders', sr_RS: 'Ivice cvetnih leja' },
    { label: 'outdoor_carpets', sr_RS: 'Spoljašnji tepisi' },
    { label: 'raised_beds', sr_RS: 'Podignuti gredici' },
    {
      label: 'vertical_garden_structures',
      sr_RS: 'Vertikalne baštenske konstrukcije'
    },
    { label: 'outdoor_cushions', sr_RS: 'Spoljašnje jastučiće' },
    { label: 'patio_umbrellas', sr_RS: 'Suncobrani za terasu' },
    { label: 'garden_pavilions', sr_RS: 'Baštenski paviljoni' },
    { label: 'plant_stands', sr_RS: 'Postolja za biljke' },
    { label: 'garden_mirrors', sr_RS: 'Baštenska ogledala' },
    { label: 'outdoor_screens', sr_RS: 'Spoljašnji ekrani' },
    { label: 'solar_lights', sr_RS: 'Solarno svetlo' },
    { label: 'garden_ornaments', sr_RS: 'Baštenski ornament' }
  ],
  everything_for_plants: [
    { label: 'fertilizers', sr_RS: 'đubriva' },
    { label: 'plant_tools', sr_RS: 'Alati za biljke' },
    { label: 'soil', sr_RS: 'Zemlja' },
    { label: 'plant_protection', sr_RS: 'Zaštita biljaka' },
    { label: 'watering_systems', sr_RS: 'Sistemi za zalivanje' },
    { label: 'plant_stakes', sr_RS: 'Kolčići za biljke' },
    { label: 'plant_labels', sr_RS: 'Oznake za biljke' },
    { label: 'plant_cages', sr_RS: 'Kavezi za biljke' },
    { label: 'grow_lights', sr_RS: 'Svetla za rast' },
    { label: 'humidity_trays', sr_RS: 'Posude za vlagu' },
    { label: 'self_watering_pots', sr_RS: 'Samostalno zalivajuće saksije' },
    { label: 'plant_misters', sr_RS: 'Prskalice za biljke' },
    { label: 'watering_cans', sr_RS: 'Posude za zalivanje' },
    { label: 'pruning_shears', sr_RS: 'Sekatatori' },
    { label: 'gardening_gloves', sr_RS: 'Baštenske rukavice' },
    { label: 'plant_trays', sr_RS: 'Posude za sadnice' },
    { label: 'mulch', sr_RS: 'Malč' },
    { label: 'peat_moss', sr_RS: 'Treset' },
    { label: 'perlite', sr_RS: 'Perlit' },
    { label: 'vermiculite', sr_RS: 'Vermikulit' },
    { label: 'rooting_hormones', sr_RS: 'Hormoni za korenjenje' },
    { label: 'pest_control_sprays', sr_RS: 'Sprejevi za suzbijanje štetočina' },
    { label: 'biodegradable_pots', sr_RS: 'Biorazgradive saksije' },
    { label: 'plant_covers', sr_RS: 'Pokrivači za biljke' },
    { label: 'compost_bins', sr_RS: 'Kante za kompost' },
    { label: 'greenhouses', sr_RS: 'Staklenici' },
    { label: 'grow_tents', sr_RS: 'Raste šatore' },
    { label: 'plant_heating_mats', sr_RS: 'Grejne podloge za biljke' },
    { label: 'plant_grafting_tools', sr_RS: 'Alati za grafting biljaka' },
    { label: 'hydroponic_systems', sr_RS: 'Hidroponski sistemi' },
    {
      label: 'drip_irrigation_kits',
      sr_RS: 'Set za kap po kap navodnjavanje'
    },
    {
      label: 'plant_nutrient_solutions',
      sr_RS: 'Rastvori za hranljive materije biljaka'
    },
    { label: 'planters_with_reservoirs', sr_RS: 'Saksije sa rezervoarima' },
    { label: 'plant_trellis', sr_RS: 'Rešetke za biljke' },
    { label: 'plant_clips', sr_RS: 'Stezaljke za biljke' },
    { label: 'bonsai_tools', sr_RS: 'Alati za bonsai' },
    { label: 'plant_saucers', sr_RS: 'Tanjirići za biljke' },
    { label: 'plant_supports', sr_RS: 'Potpore za biljke' },
    { label: 'pH_meters', sr_RS: 'PH meteri' },
    { label: 'soil_test_kits', sr_RS: 'Kitovi za ispitivanje tla' },
    { label: 'compost_tea_brewers', sr_RS: 'Spravljači čaja od komposta' }
  ]
};

export const groupItemsCreateProduct: GroupItemCreateProduct[] = [
  {
    key: 'flower_assortment',
    label: 'Cvetni asortiman',
    icon: <LoginOutlined />
  },
  {
    key: 'succulents',
    label: 'Sukulenti',
    icon: <LoginOutlined />
  },
  {
    key: 'potted_flowers',
    label: 'Saksijsko cveće',
    icon: <LoginOutlined />
  },
  {
    key: 'seedlings',
    label: 'Sadnice',
    icon: <LoginOutlined />
  },
  {
    key: 'fruits_and_vegetables',
    label: 'Voće i povrće',
    icon: <LoginOutlined />
  },
  {
    key: 'herbal_pharmacy',
    label: 'Biljna apoteka',
    icon: <LoginOutlined />
  },
  {
    key: 'garden_decoration',
    label: 'Baštenska dekoracija',
    icon: <LoginOutlined />
  },
  {
    key: 'everything_for_plants',
    label: 'Sve za biljke',
    icon: <LoginOutlined />
  }
];
