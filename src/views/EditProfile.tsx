import { SignatureOutlined } from '@ant-design/icons';
import { BackButton } from '@green-world/components';
// import { useUser } from '@green-world/hooks/useUser';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';

export const EditProfile = () => {
  //   const { data } = useUser();

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Azuriraj profil</title>
        <link rel="canonical" href="https://www.zeleni-svet.com/edit-profile" />
      </Helmet>
      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-10',
          'flex',
          'flex-col',
          'gap-7'
        )}
      >
        <section
          className={clsx(
            'flex',
            'items-center',
            'w-full',
            'justify-center',
            'relative',
            'mb-4'
          )}
        >
          <div className={clsx('hidden', 'md:flex', 'absolute', 'left-0')}>
            <BackButton />
          </div>
          <h1
            className={clsx('text-forestGreen', 'text-5xl', 'md:text-6xl')}
            style={{ fontFamily: 'GreenWorld' }}
          >
            Azurirajte profil
          </h1>
        </section>
        <form className={clsx('flex', 'flex-col', 'md:flex-row', 'md:gap-10')}>
          <div className={clsx('flex-1', 'flex', 'flex-col')}>
            {/* {data.role === 'seller' && (
              <> */}
            <label
              htmlFor="title"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Naziv Vaseg biznisa:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="title"
                id="title"
                placeholder="Unesite naziv Vaseg biznisa"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
              />
              <SignatureOutlined
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[11px]',
                  'text-xl'
                )}
              />
            </div>
            {/* </>
            )} */}
            <label
              htmlFor="title"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Vase ime:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="title"
                id="title"
                placeholder="Unesite Vase ime"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
              />
              <SignatureOutlined
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[11px]',
                  'text-xl'
                )}
              />
            </div>
            <label
              htmlFor="title"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Vase prezime:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="title"
                id="title"
                placeholder="Unesite Vase prezime"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
              />
              <SignatureOutlined
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[11px]',
                  'text-xl'
                )}
              />
            </div>
            <label
              htmlFor="title"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Opisite Vas biznis ili unesite viziju ili slogan:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <textarea
                required
                name="title"
                id="title"
                placeholder="Unesite opis"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
              />
              <SignatureOutlined
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[11px]',
                  'text-xl'
                )}
              />
            </div>
          </div>
          <div className={clsx('flex-1', 'flex', 'flex-col')}>
            <label
              htmlFor="title"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Website vase radnje:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="title"
                id="title"
                placeholder="Unesite Website"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
              />
              <SignatureOutlined
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[11px]',
                  'text-xl'
                )}
              />
            </div>
            <label
              htmlFor="title"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Mesto vase glavne prodavnice:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="title"
                id="title"
                placeholder="Unesite Website"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
              />
              <SignatureOutlined
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[11px]',
                  'text-xl'
                )}
              />
            </div>
            <label
              htmlFor="title"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              adresa:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="title"
                id="title"
                placeholder="adresa"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
              />
              <SignatureOutlined
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[11px]',
                  'text-xl'
                )}
              />
            </div>
            <label
              htmlFor="title"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              broj:
            </label>
            <div className={clsx('w-full', 'relative')}>
              <input
                required
                type="text"
                name="title"
                id="title"
                placeholder="broj"
                className={clsx(
                  'w-full',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'pl-9',
                  'py-2',
                  'shadow-md',
                  'mb-4',
                  'bg-whiteLinen'
                )}
              />
              <SignatureOutlined
                className={clsx(
                  'text-gray',
                  'absolute',
                  'left-3',
                  'top-[11px]',
                  'text-xl'
                )}
              />
            </div>
            <label
              htmlFor="title"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Poslujemo samo online:
            </label>
            <label
              htmlFor="title"
              className={clsx(
                'mb-2',
                'text-forestGreen',
                'cursor-pointer',
                'text-lg'
              )}
            >
              Poslujemo samo preko vaseg sajta:
            </label>
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
          </div>
        </form>
      </div>
    </div>
  );
};
