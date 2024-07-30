import { Result } from 'antd';
import clsx from 'clsx';
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction
} from 'react';

interface SuccessContextProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const SuccessContext = createContext<SuccessContextProps | undefined>(
  undefined
);

export const SuccessProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SuccessContext.Provider value={{ setIsOpen }}>
      {children}
      {isOpen && (
        <section
          className={clsx(
            'fixed',
            'top-0',
            'left-0',
            'h-full',
            'w-full',
            'bg-groupTransparent',
            'z-50',
            'flex',
            'justify-center',
            'items-center',
            'overflow-scroll'
          )}
        >
          <section
            className={clsx(
              'bg-teaGreen',
              'shadow-md',
              'rounded',
              'p-5',
              'py-8',
              'md:py-14',
              'w-full',
              'max-w-xl',
              'mx-auto',
              'mt-10'
            )}
          >
            <Result
              status="success"
              title={
                <h1 className={clsx('mb-4', 'text-forestGreen', 'text-xl')}>
                  <strong>
                    Uspesno ste se registrovali na{' '}
                    <a href="https://www.zeleni-svet.com">zeleni-svet.com</a> !
                  </strong>
                </h1>
              }
              subTitle="Posetite stranicu profil, kako bi ste popunili podatke Vašeg biznisa"
              extra={
                <div
                  key="home"
                  className={clsx(
                    'w-full',
                    'flex',
                    'justify-center',
                    'flex-col',
                    'md:flex-row',
                    'gap-6'
                  )}
                >
                  <a
                    href={'/'}
                    className={clsx(
                      'text-forestGreen',
                      'md:hover:text-seaFoamGreen',
                      'leading-normal',
                      'font-medium',
                      'border-2',
                      'rounded-md',
                      'min-h-12',
                      'max-h-12',
                      'w-28',
                      'p-4',
                      'flex',
                      'items-center',
                      'justify-center',
                      'text-center',
                      'shadow-md',
                      'transition'
                    )}
                  >
                    Početna
                  </a>
                  <a
                    href={'/profile'}
                    className={clsx(
                      'text-forestGreen',
                      'md:hover:text-seaFoamGreen',
                      'leading-normal',
                      'font-medium',
                      'border-2',
                      'rounded-md',
                      'min-h-12',
                      'max-h-12',
                      'w-28',
                      'p-4',
                      'flex',
                      'items-center',
                      'justify-center',
                      'text-center',
                      'shadow-md',
                      'transition'
                    )}
                  >
                    Profil
                  </a>
                </div>
              }
            />
          </section>
        </section>
      )}
    </SuccessContext.Provider>
  );
};

export const useSuccess = (): SuccessContextProps => {
  const context = useContext(SuccessContext);

  if (context === undefined) {
    throw new Error('useSuccess must be used within a SuccessProvider');
  }

  return context;
};
