import { Footer, Header, MetaTags } from '@green-world/components';
import { Result } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <MetaTags title={t('notFoundView.metaTitle')} />

      <Header />
      <section className="min-h-viewHeight flex justify-center items-center">
        <Result
          status="404"
          title="404"
          subTitle={t('notFoundView.subtitle')}
          extra={
            <section className="flex flex-col md:flex-row justify-center gap-10 w-full px-4 mx-auto">
              <Link
                className="text-forestGreen md:hover:text-seaFoamGreen leading-normal font-medium border-2 rounded-md min-h-12 p-4 max-h-12 flex items-center justify-center text-center shadow-md transition"
                to="/"
              >
                {t('notFoundView.home')}
              </Link>
              <Link
                className="text-forestGreen md:hover:text-seaFoamGreen leading-normal font-medium border-2 rounded-md min-h-12 p-4 max-h-12 flex items-center justify-center text-center shadow-md transition"
                to="/login"
              >
                {t('notFoundView.login')}
              </Link>
            </section>
          }
        />
      </section>
      <Footer />
    </React.Fragment>
  );
};
