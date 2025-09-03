import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { CustomButton } from '../CustomButton';

import heroImage from '/lush-green-garden-with-beautiful-plants-and-flower.png';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden max-w-[1440px] mx-auto">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroImage})`
        }}
      >
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          Negujte Svoj Zeleni Prostor
        </h1>
        <p className="text-lg md:text-xl mb-8 text-balance opacity-90 max-w-2xl mx-auto">
          Otkrijte naš pažljivo odabran asortiman biljaka, cveća i dodataka za
          baštu. Stvorite oazu mira u svom domu.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CustomButton
            type="primary"
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => navigate('/search')}
          >
            Istražite Proizvode
            <ArrowRight className="ml-2 h-5 w-5" />
          </CustomButton>
          <CustomButton
            type="primary"
            size="lg"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() =>
              window.location.replace(
                'https://www.instagram.com/zeleni_svet_rs/'
              )
            }
          >
            Saznajte Više
          </CustomButton>
        </div>
      </div>
    </section>
  );
};
