import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';

export const UnderConstruction = () => {
  return (
    <div
      className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}
      style={{
        backgroundImage: "url('/background_login.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <Helmet>
        <title>Zeleni svet | Prijavi se</title>
        <link rel="canonical" href="https://www.zeleni-svet.com/u-izradi" />
      </Helmet>
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
