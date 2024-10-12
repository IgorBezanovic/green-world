import { LoadingOutlined } from '@ant-design/icons';
import { BackButton, CustomButton, CustomInput } from '@green-world/components';
import TextArea from 'antd/es/input/TextArea';
import clsx from 'clsx';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export const ContactUs = () => {
  const isLoading = false;
  const [contactForm, setContactForm] = useState({
    subject: '',
    contact: '',
    message: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm({ ...contactForm, [name]: value });
  };

  const handleSubmit = () => {
    console.log(contactForm);
  };

  return (
    <div className={clsx('w-full', 'bg-whiteLinen', 'min-h-viewHeight')}>
      <Helmet>
        <title>Zeleni svet | Kontaktirajte nas</title>
        <link rel="canonical" href="https://www.zeleni-svet.com/contac-us" />
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
            Kontektirajte nas
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
            value={contactForm?.subject || ''}
            onChange={handleChange}
            placeholder="Tema poruke"
          />
          <label
            htmlFor="contact"
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
            name="contact"
            id="contact"
            value={contactForm?.contact || ''}
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
                'border-forestGreen': !isLoading,
                'border-groupTransparent': isLoading
              }
            )}
          />
          <CustomButton
            htmlType="submit"
            type="text"
            text={
              isLoading ? (
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
                'border-groupTransparent': isLoading
              }
            ]}
            disabled={isLoading}
          />
        </form>
      </div>
    </div>
  );
};
