import clsx from 'clsx';
import { Helmet } from 'react-helmet';
import './style.css';

export const Profile = () => {
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <link
          rel="canonical"
          href="https://www.green-world-six.vercel.app/profile"
        />
      </Helmet>
      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'flex',
          'flex-col',
          'mx-auto',
          'px-7',
          'xl:px-0',
          'py-7',
          'gap-7'
        )}
      >
        <div className={clsx('w-full', 'h-[150px]', 'bg-seaFoamGreen')}>
          header image radnje
        </div>
        <div className={clsx('flex', 'gap-7')}>
          <div className={clsx('w-1/4', 'bg-primary')}>
            Informacije o prodavcu
            <br />
            - profilna slika
            <br />
            - naziv prodavnice
            <br />
            dugme prikazi kontakt
            <br />
            - kontakt telefon
            <br />
            - kontakt email
            <br />
            google maps box
          </div>
          <div className={clsx('w-3/4')}>
            <div className={clsx('w-full', 'flex', 'gap-7', 'mb-7')}>
              <button
                className={clsx(
                  'flex-1',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'py-2',
                  'px-4',
                  'shadow-md',
                  'bg-whiteLinen'
                )}
              >
                Ponuda
              </button>
              <button
                className={clsx(
                  'flex-1',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'py-2',
                  'px-4',
                  'shadow-md',
                  'bg-whiteLinen'
                )}
              >
                Kontaktirajte nas
              </button>
              <button
                className={clsx(
                  'flex-1',
                  'border-2',
                  'border-forestGreen',
                  'rounded',
                  'py-2',
                  'px-4',
                  'shadow-md',
                  'bg-whiteLinen'
                )}
              >
                Podesavanje profila
              </button>
            </div>
            <form
              className={clsx(
                'w-full',
                'flex',
                'justify-between',
                'bg-mintCream',
                'p-2',
                'shadow-md',
                'rounded'
              )}
            >
              <div className={clsx('flex', 'gap-5')}>
                <input
                  type="text"
                  placeholder="Pretrazi proizvod"
                  className={clsx(
                    'border-2',
                    'border-forestGreen',
                    'rounded',
                    'pl-2',
                    'py-2',
                    'shadow-md',
                    'bg-whiteLinen'
                  )}
                />
                <div className="dropdown">
                  <button
                    className={clsx(
                      'border-2',
                      'border-forestGreen',
                      'rounded',
                      'py-2',
                      'px-4',
                      'shadow-md',
                      'bg-whiteLinen'
                    )}
                  >
                    Select Options
                  </button>
                  <div className="dropdown-content">
                    <label>
                      <input type="checkbox" name="plant" value="zimzeleno" />
                      Zimzeleno
                    </label>
                    <label>
                      <input type="checkbox" name="plant" value="cvece" /> Cvece
                    </label>
                    <label>
                      <input type="checkbox" name="plant" value="saksijsko" />
                      Saksijsko
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="plant"
                        value="visegodisnje"
                      />
                      Visegodisnje
                    </label>
                  </div>
                </div>
              </div>
              <button
                className={clsx(
                  'bg-forestGreen',
                  'rounded',
                  'py-2',
                  'px-4',
                  'shadow-md',
                  'text-mintCream'
                )}
              >
                Pretrazi
              </button>
            </form>
            <section className={clsx('py-5', 'bg-primary')}>Ponuda</section>
          </div>
        </div>
      </div>
    </div>
  );
};
