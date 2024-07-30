import { UserInfo } from '@green-world/components';
import { setUnauthenticated } from '@green-world/context/authSlice';
import { useUser } from '@green-world/hooks/useUser';
import { removeItem } from '@green-world/utils/cookie';
import clsx from 'clsx';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './style.css';

export const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useUser();

  const handleLogout = () => {
    removeItem('token');
    dispatch(setUnauthenticated());
    navigate('/');
  };

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Korisnicki profil</title>
        <link rel="canonical" href="https://www.zeleni-svet.com/profile" />
      </Helmet>
      <div
        className={clsx(
          'xl:max-w-[1400px]',
          'w-full',
          'flex',
          'flex-col',
          'mx-auto',
          'px-4',
          'sm:px-6',
          'xl:px-0',
          'py-7',
          'gap-7'
        )}
      >
        <div
          className={clsx('w-full', 'h-[200px]', 'shadow')}
          style={{
            backgroundImage:
              'url(https://res.cloudinary.com/dijofqxeu/image/upload/v1721477880/ttkwlmkmjwui4avw2dkb.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className={clsx('flex', 'gap-7')}>
          <section className={clsx('w-1/4')}>
            <UserInfo user={data} />
          </section>
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
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
};
