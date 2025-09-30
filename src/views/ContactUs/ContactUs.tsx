import { LoadingOutlined } from '@ant-design/icons';
import {
  BackButton,
  CustomButton,
  CustomInput,
  MetaTags
} from '@green-world/components';
import { useContactUs } from '@green-world/hooks/useContactUs';
import { ContactUsValues } from '@green-world/utils/types';
import TextArea from 'antd/es/input/TextArea';
import clsx from 'clsx';
import { ReactNode, useState } from 'react';

export const ContactUs = () => {
  const { mutate, error, isPending } = useContactUs();
  const [contactForm, setContactForm] = useState<ContactUsValues>({
    subject: '',
    email: '',
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(contactForm, {
      onSuccess: () => {
        setContactForm({
          subject: '',
          email: '',
          message: ''
        });
      }
    });
  };

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <MetaTags title={'Zeleni svet | Kontaktirajte nas'} />
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
            className={clsx(
              'text-forestGreen',
              'text-5xl',
              'md:text-6xl',
              'font-ephesis'
            )}
          >
            Kontaktirajte nas
          </h1>
        </section>
        <form
          className={clsx('flex', 'flex-col', 'max-w-xl', 'w-full', 'mx-auto')}
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="subject"
            className={clsx(
              'mb-2',
              'text-forestGreen',
              'cursor-pointer',
              'text-lg'
            )}
          >
            Tema poruke:
          </label>
          <CustomInput
            required
            type="text"
            name="subject"
            id="subject"
            disabled={isPending}
            value={contactForm?.subject || ''}
            onChange={handleChange}
            placeholder="Tema poruke"
          />
          <label
            htmlFor="email"
            className={clsx(
              'mb-2',
              'text-forestGreen',
              'cursor-pointer',
              'text-lg'
            )}
          >
            Unesite kontat telefon ili e-mail:
          </label>
          <CustomInput
            required
            type="text"
            name="email"
            id="email"
            disabled={isPending}
            value={contactForm?.email || ''}
            onChange={handleChange}
            placeholder="Kako da vas kontaktiramo"
          />
          <label
            htmlFor="message"
            className={clsx(
              'mb-2',
              'text-forestGreen',
              'cursor-pointer',
              'text-lg'
            )}
          >
            Poruka:
          </label>
          <TextArea
            required
            name="message"
            id="message"
            rows={10}
            disabled={isPending}
            value={contactForm?.message || ''}
            onChange={handleChange}
            placeholder="Unesite poruku"
            className={clsx(
              'flex-1',
              'rounded-xs',
              'shadow-md',
              'h-full',
              'min-h-[42px]',
              'md:hover:shadow-lg',
              'mb-4',
              {
                'border-forestGreen': !isPending,
                'border-groupTransparent': isPending
              }
            )}
          />
          <CustomButton
            htmlType="submit"
            type="text"
            text={
              isPending ? (
                <LoadingOutlined
                  className={clsx('text-groupTransparent', 'my-2')}
                />
              ) : (
                'Pošalji poruku'
              )
            }
            customStyle={[
              'mt-6',
              {
                'border-groupTransparent': isPending
              }
            ]}
            disabled={isPending}
          />
          {(error as ReactNode) && (
            <p className={clsx('font-medium', 'text-red', 'mt-2')}>
              {String(
                (error as { response?: { data?: string } })?.response?.data ||
                  'An error occurred. Please try again.'
              )}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
