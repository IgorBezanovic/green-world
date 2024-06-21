import clsx from 'clsx';
import { Helmet } from 'react-helmet';
import './style.css';

export const Profile = () => {
  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-[100vh]')}>
      <Helmet>
        <link
          rel="canonical"
          href="https://www.green-world-six.vercel.app/profile"
        />
      </Helmet>
      <div className={clsx('max-w-[1400px]', 'mx-auto', 'p-5', 'gap-5')}>
        <div className={clsx('w-full', 'h-[150px]', 'bg-seaFoamGreen', 'mb-5')}>
          header image radnje
        </div>
        <div className={clsx('flex', 'gap-5')}>
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
            <div className={clsx('w-full', 'flex', 'gap-5', 'mb-5')}>
              <button
                className={clsx(
                  'flex-1',
                  'border-2',
                  'border-forestGreen',
                  'rounded-md',
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
                  'rounded-md',
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
                  'rounded-md',
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
                'rounded-md'
              )}
            >
              <div className={clsx('flex', 'gap-5')}>
                <input
                  type="text"
                  placeholder="Pretrazi proizvod"
                  className={clsx(
                    'border-2',
                    'border-forestGreen',
                    'rounded-md',
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
                      'rounded-md',
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
                  'rounded-md',
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
