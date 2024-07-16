import clsx from 'clsx';

export const ForgotPasswordForm = () => {
  return (
    <section
      className={clsx(
        'bg-teaGreen',
        'shadow-md',
        'rounded',
        'p-5',
        'md:py-14',
        'w-full',
        'max-w-2xl',
        'mx-auto',
        'mt-10'
      )}
    >
      <form
        className={clsx('flex', 'flex-col', 'max-w-96', 'w-full', 'mx-auto')}
      >
        <h1 className={clsx('mb-4', 'text-forestGreen', 'text-xl')}>
          <strong>Ukoliko ste zaboravili svoj password, nije problem.</strong>
        </h1>
        <label
          htmlFor="email"
          className={clsx('mb-4', 'text-forestGreen', 'text-lg')}
        >
          Kontaktiracemo Vas da promenu svoje lozinke:
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Unesite email"
          className={clsx(
            'w-full',
            'border-2',
            'border-forestGreen',
            'rounded',
            'pl-2',
            'py-2',
            'shadow-md',
            'mb-4',
            'bg-whiteLinen'
          )}
        />
        <button
          className={clsx(
            'mt-2',
            'w-full',
            'bg-forestGreen',
            'rounded',
            'py-2',
            'shadow-md',
            'text-mintCream'
          )}
        >
          Promeni password
        </button>
      </form>
    </section>
  );
};
