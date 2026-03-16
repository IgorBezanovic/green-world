export const serviceCategories = {
  obrada_zemlje: {
    label: '🌱 Obrada zemlje',
    services: [
      'Freziranje zemlje',
      'Oranje bašte',
      'Kopanje ručno',
      'Kopanje mini bagerom',
      'Ravnanje zemljišta',
      'Priprema zemljišta za sadnju',
      'Poboljšanje kvaliteta zemljišta',
      'Dodavanje humusa',
      'Dodavanje komposta',
      'Analiza zemljišta',
      'Neutralizacija kiselosti zemlje',
      'Priprema zemlje za travnjak',
      'Postavljanje sistema za drenažu',
      'Aeracija zemljišta',
      'Razbijanje zbijene zemlje'
    ]
  },
  sadnja_i_rad_sa_biljkama: {
    label: '🌿 Sadnja i rad sa biljkama',
    services: [
      'Sadnja cvetnica',
      'Sadnja drveća',
      'Sadnja voćaka',
      'Sadnja živih ograda',
      'Sadnja sadnica povrća',
      'Presađivanje biljaka',
      'Presađivanje velikih stabala',
      'Postavljanje vertikalnih bašti',
      'Sadnja ukrasnog bilja',
      'Sadnja zimzelenih biljaka',
      'Sadnja sezonskog cveća',
      'Sadnja začinskog bilja',
      'Sadnja travnjaka'
    ]
  },
  odrzavanje_dvorista: {
    label: '🌳 Održavanje dvorišta',
    services: [
      'Košenje trave',
      'Malčiranje',
      'Sakupljanje lišća',
      'Čišćenje dvorišta',
      'Čišćenje zapuštenih parcela',
      'Održavanje travnjaka',
      'Popravka travnjaka',
      'Dosijavanje trave',
      'Vertikulacija travnjaka',
      'Aeracija travnjaka'
    ]
  },
  orezivanje_i_oblikovanje: {
    label: '✂️ Orezivanje i oblikovanje',
    services: [
      'Orezivanje voćaka',
      'Orezivanje ukrasnog drveća',
      'Orezivanje žive ograde',
      'Stilsko orezivanje biljaka',
      'Bonsai oblikovanje',
      'Skraćivanje grana',
      'Sanitarno orezivanje',
      'Formiranje krošnje',
      'Sezonsko orezivanje'
    ]
  },
  zalivanje_i_sistemi: {
    label: '💧 Zalivanje i sistemi',
    services: [
      'Zalivanje bašte',
      'Zalivanje biljaka',
      'Održavanje sistema za navodnjavanje',
      'Postavljanje sistema kap po kap',
      'Automatsko navodnjavanje',
      'Navodnjavanje travnjaka',
      'Servis sistema za navodnjavanje'
    ]
  },
  dekoracija_dvorista: {
    label: '🪴 Dekoracija dvorišta',
    services: [
      'Dekoracija dvorišta',
      'Dekoracija terasa',
      'Dekoracija balkona',
      'Dekoracija događaja biljkama',
      'Postavljanje saksija',
      'Postavljanje žardinjera',
      'Izrada cvetnih aranžmana'
    ]
  },
  dizajn_eksterijera: {
    label: '🏡 Dizajn eksterijera',
    services: [
      'Landscape dizajn',
      'Dizajn dvorišta',
      'Dizajn vrta',
      'Dizajn balkona',
      'Dizajn terase',
      '3D projektovanje vrta',
      'Plan sadnje biljaka',
      'Savetovanje za uređenje dvorišta'
    ]
  },
  ostale_usluge: {
    label: '🪚 Ostale usluge',
    services: [
      'Sečenje drva',
      'Sečenje voćaka',
      'Uklanjanje panjeva',
      'Uklanjanje stabala',
      'Transport biljaka',
      'Dostava sadnica',
      'Postavljanje baštenskog nameštaja',
      'Postavljanje dekorativnog kamenja',
      'Postavljanje staza u dvorištu',
      'Postavljanje travnog tepiha'
    ]
  }
};

export const getAllPredefinedServices = () => {
  return Object.values(serviceCategories).flatMap(
    (category) => category.services
  );
};
