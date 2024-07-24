import {
  CheckCircleOutlined,
  InstagramFilled,
  LinkedinFilled
} from '@ant-design/icons';
import { Logo } from '@green-world/components';
import clsx from 'clsx';

export const Footer = () => {
  return (
    <footer
      className={clsx(
        'bg-forestGreen',
        'shadow',
        'px-4',
        'sm:px-7',
        'xl:px-0',
        'py-10'
      )}
    >
      <section
        className={clsx(
          'max-w-[1400px]',
          'mx-auto',
          'grid',
          'grid-cols-1',
          'xs:grid-cols-2',
          'lg:grid-cols-4',
          'gap-10',
          'md:gap-20'
        )}
      >
        <div className={clsx('text-whiteLinen')}>
          <p className={clsx('mb-2')}>Pratite/Kontaktirajte nas na:</p>
          <div className={clsx('flex', 'gap-2')}>
            <a href="https://www.instagram.com/zeleni_svet_rs/" target="blanc">
              <InstagramFilled className={clsx('text-2xl', 'cursor-pointer')} />
            </a>
            <a
              href="https://www.linkedin.com/company/zeleni-svet/"
              target="blanc"
            >
              <LinkedinFilled
                className={clsx('text-2xl', 'mr-2', 'cursor-pointer')}
              />
            </a>
          </div>
          <form className={clsx('flex', 'flex-col', 'mt-4')}>
            <label>Prijavi se da primas katalog na email: </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Unesite email"
              className={clsx(
                'w-full',
                'border-2',
                'border-whiteLinen',
                'rounded',
                'pl-1',
                'py-1',
                'shadow-md',
                'mt-2',
                'bg-whiteLinen'
              )}
            />
            <button
              className={clsx(
                'mt-4',
                'w-full',
                'bg-whiteLinen',
                'rounded',
                'py-1',
                'shadow-md',
                'text-forestGreen'
              )}
              onClick={() => console.log('aa')}
            >
              Prijavi se
            </button>
          </form>
        </div>

        <div className={clsx('text-whiteLinen')}>
          <p className={clsx('mb-0.5')}>Kontaktirajte nas mailom:</p>
          <p className={clsx('mb-4')}>
            <a href="mailto:zelenisvetinfo@gmail.com">
              zelenisvetinfo@gmail.com
            </a>
          </p>
          <Logo width="100px" height="100px" />
        </div>

        <div className={clsx('text-whiteLinen')}>
          <p className={clsx('mb-4')}>Nudimo korisnicku podrsku:</p>
          <ul>
            <li className={clsx('mb-2')}>
              <CheckCircleOutlined className={clsx('mr-2')} /> Kreiranje naloga
            </li>
            <li className={clsx('mb-2')}>
              <CheckCircleOutlined className={clsx('mr-2')} /> Kreiranje radnje
            </li>
            <li>
              <CheckCircleOutlined className={clsx('mr-2')} /> Kreiranje oglasa
            </li>
          </ul>
        </div>
        <div className={clsx('text-whiteLinen')}>
          <p className={clsx('font-semibold')}>
            Zelite da istaknete svoj oglas/radnju na pocetnoj strani?
          </p>
          <p className={clsx('mb-4')}>
            <a href="mailto:zelenisvetinfo@gmail.com">
              zelenisvetinfo@gmail.com
            </a>
          </p>
          <p>
            Takodje mozete da zakupite reklamni baner u periodu{' '}
            <span className={clsx('font-bold')}>7</span> /{' '}
            <span className={clsx('font-bold')}>14</span> /{' '}
            <span className={clsx('font-bold')}>28</span> dana
          </p>
        </div>
      </section>
    </footer>
  );
};
