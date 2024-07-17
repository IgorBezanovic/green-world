import clsx from 'clsx';
import { createContext, useState, useContext, ReactNode } from 'react';

interface CreateAdContextProps {
  handleOpenPopup: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const CreateAdContext = createContext<CreateAdContextProps | undefined>(
  undefined
);

export const CreateAdProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenPopup = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <CreateAdContext.Provider value={{ handleOpenPopup }}>
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
            'items-center'
          )}
          onClick={handleOpenPopup}
        >
          <section
            onClick={(e) => e.stopPropagation()}
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
            <form
              className={clsx(
                'flex',
                'flex-col',
                'max-w-96',
                'w-full',
                'mx-auto'
              )}
            >
              <h1 className={clsx('mb-4', 'text-forestGreen', 'text-xl')}>
                <strong>Kreirajte svoj oglas</strong>
              </h1>
              <label
                htmlFor="title"
                className={clsx(
                  'mb-2',
                  'text-forestGreen',
                  'cursor-pointer',
                  'text-lg'
                )}
              >
                Naziv proizvoda:
              </label>
              <input
                required
                type="title"
                name="title"
                id="title"
                placeholder="Unesite naziv proizvoda"
                className={clsx(
                  'w-full',
                  'border-2',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
              />
              <button
                type="submit"
                className={clsx(
                  'mt-4',
                  'w-full',
                  'rounded',
                  'py-2',
                  'shadow-md',
                  'text-mintCream',
                  'transition-all',
                  'flex',
                  'justify-center',
                  'items-center',
                  'bg-forestGreen'
                )}
              >
                Kreiraj
              </button>
            </form>
          </section>
        </section>
      )}
    </CreateAdContext.Provider>
  );
};

export const useCreateAd = (): CreateAdContextProps => {
  const context = useContext(CreateAdContext);
  if (context === undefined) {
    throw new Error('useCreateAd must be used within a CreateAdProvider');
  }
  return context;
};
