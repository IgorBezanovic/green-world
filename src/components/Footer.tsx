import {
  CheckCircleOutlined,
  InstagramFilled,
  LinkedinFilled
} from '@ant-design/icons';
import { CustomButton, CustomInput, Logo } from '@green-world/components';
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
          <p className={clsx('mb-2')}>Social media</p>
          <div className={clsx('flex', 'gap-2')}>
            <a href="https://www.instagram.com/zeleni_svet_rs/" target="blanc">
              <InstagramFilled
                className={clsx('text-3xl', 'cursor-pointer', 'shadow-xl')}
              />
            </a>
            <a
              href="https://www.linkedin.com/company/zeleni-svet/"
              target="blanc"
            >
              <LinkedinFilled
                className={clsx(
                  'text-3xl',
                  'mr-2',
                  'cursor-pointer',
                  'shadow-xl'
                )}
              />
            </a>
          </div>
          <form className={clsx('flex', 'flex-col', 'mt-4')}>
            <label htmlFor="email">
              Prijavi se da primaš katalog na email:
            </label>
            <CustomInput
              type="text"
              name="email"
              id="email"
              placeholder="Unesite email"
              autoComplete="true"
            />
            <CustomButton
              type="text"
              customStyle={['bg-whiteLinen', 'mt-4', 'min-h-[22px]']}
              onClick={() => console.log('aa')}
              text="Prijavi se"
            />
          </form>
        </div>

        <div className={clsx('text-whiteLinen')}>
          <p className={clsx('mb-0.5')}>Kontaktirajte nas:</p>
          <p className={clsx('mb-4')}>
            <a href="mailto:zelenisvetinfo@gmail.com">
              zelenisvetinfo@gmail.com
            </a>
          </p>
          <Logo width="100px" height="100px" />
        </div>

        <div className={clsx('text-whiteLinen')}>
          <p className={clsx('mb-4')}>Nudimo korisničku podršku:</p>
          <ul>
            <li className={clsx('mb-2')}>
              <CheckCircleOutlined className={clsx('mr-2')} /> Kreiranje naloga
            </li>
            <li className={clsx('mb-2')}>
              <CheckCircleOutlined className={clsx('mr-2')} /> Kreiranje radnje
            </li>
            <li className={clsx('mb-2')}>
              <CheckCircleOutlined className={clsx('mr-2')} /> Kreiranje oglasa
            </li>
            <li>
              <CheckCircleOutlined className={clsx('mr-2')} /> Kreiranje
              događaja
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
          {/* <p>
            Takodje mozete da zakupite reklamni baner u periodu{' '}
            <span className={clsx('font-bold')}>7</span> /{' '}
            <span className={clsx('font-bold')}>14</span> /{' '}
            <span className={clsx('font-bold')}>28</span> dana
          </p> */}
        </div>
      </section>
    </footer>
  );
};
