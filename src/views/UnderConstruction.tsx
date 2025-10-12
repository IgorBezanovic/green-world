import { MetaTags } from '@green-world/components';
import clsx from 'clsx';

export const UnderConstruction = () => {
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={'Zeleni svet | Stranica je trenutno u izradi'} />
      <div className="bg-gray-100">
        <div className="min-h-screen flex flex-col justify-center items-center">
          <img
            src="https://www.svgrepo.com/show/426192/cogs-settings.svg"
            alt="Logo"
            className="mb-8 h-40"
          />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-700 mb-4">
            Stranica je trenutno u izradi
          </h1>
          <p className="text-center text-gray-500 text-lg md:text-xl lg:text-2xl mb-8">
            Naporno radimo na poboljšanju korisničkog iskustva. Ostanite sa
            nama!
          </p>
        </div>
      </div>
    </div>
  );
};
