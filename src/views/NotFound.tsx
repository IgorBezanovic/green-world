import { Footer, Header, MetaTags } from '@green-world/components';
import { Result } from 'antd';
import React from 'react';
import { Link } from 'react-router';

export const NotFound = () => {
  return (
    <React.Fragment>
      <MetaTags title={'Zeleni Svet | Stranica nije Pronadjena | 404'} />

      <Header />
      <section className="min-h-viewHeight flex justify-center items-center">
        <Result
          status="404"
          title="404"
          subTitle="Izgubili ste se, stranica koju pokušavate da posetite ne postoji."
          extra={
            <section className="flex flex-col md:flex-row justify-center gap-10 w-full px-4 mx-auto">
              <Link
                className="text-forestGreen md:hover:text-seaFoamGreen leading-normal font-medium border-2 rounded-md min-h-12 p-4 max-h-12 flex items-center justify-center text-center shadow-md transition"
                to="/"
              >
                Početna strana
              </Link>
              <Link
                className="text-forestGreen md:hover:text-seaFoamGreen leading-normal font-medium border-2 rounded-md min-h-12 p-4 max-h-12 flex items-center justify-center text-center shadow-md transition"
                to="/login"
              >
                Ulogujte se
              </Link>
            </section>
          }
        />
      </section>
      <Footer />
    </React.Fragment>
  );
};
