import dropin from 'braintree-web-drop-in';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

type DropinInstance = Awaited<ReturnType<typeof dropin.create>>;

export type BraintreeDropInHandle = {
  requestPaymentMethod: () => Promise<{ nonce: string }>;
};

type BraintreeDropInProps = {
  authorization: string;
  amount: number;
  currency?: string;
  locale?: string;
  onReady?: () => void;
  onError?: (err: Error) => void;
  /** Poziva se kada Braintree smatra da su podaci kartice spremni za tokenizaciju (sve obavezne polja validna). */
  onPaymentMethodRequestable?: () => void;
  /** Poziva se kada više nije requestable (npr. korisnik je obrisao broj kartice). */
  onNoPaymentMethodRequestable?: () => void;
};

export const BraintreeDropIn = forwardRef<
  BraintreeDropInHandle,
  BraintreeDropInProps
>(function BraintreeDropIn(
  {
    authorization,
    amount,
    currency = 'RSD',
    locale = 'en_US',
    onReady,
    onError,
    onPaymentMethodRequestable,
    onNoPaymentMethodRequestable
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<DropinInstance | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      requestPaymentMethod: (): Promise<{ nonce: string }> => {
        return new Promise((resolve, reject) => {
          console.warn('[Braintree] Drop-in: requestPaymentMethod pozvan');
          if (!instanceRef.current) {
            console.warn(
              '[Braintree] Drop-in: instance je null – nije spreman'
            );
            reject(new Error('Drop-in nije spreman'));
            return;
          }
          const instance = instanceRef.current;
          console.warn(
            '[Braintree] Drop-in: pozivam Braintree requestPaymentMethod (callback API)...'
          );
          // Koristimo callback API umesto Promise – u nekim okruženjima Promise nikad ne resolve/reject
          instance.requestPaymentMethod(
            (
              err: Error | null,
              payload?: { nonce?: string; paymentMethodNonce?: string }
            ) => {
              if (err) {
                console.warn(
                  '[Braintree] Drop-in: callback err',
                  err?.message || err
                );
                reject(err);
                return;
              }
              const nonce = payload?.nonce ?? payload?.paymentMethodNonce;
              if (!nonce) {
                console.warn('[Braintree] Drop-in: nema nonce u payload');
                reject(new Error('Nema nonce u odgovoru'));
                return;
              }
              console.warn('[Braintree] Drop-in: nonce dobijen');
              resolve({ nonce });
            }
          );
        });
      }
    }),
    []
  );

  useEffect(() => {
    const wrapper = containerRef.current;
    if (!wrapper || !authorization || amount < 100) return;

    const container = document.createElement('div');
    wrapper.innerHTML = '';
    wrapper.appendChild(container);

    let mounted = true;
    let dropinInstance: DropinInstance | null = null;

    dropin
      .create({
        authorization,
        container,
        locale: locale || 'en_US',
        paymentOptionPriority: ['card'],
        paypal: false,
        paypalCredit: false,
        threeDSecure: false,
        translations: {
          payingWith: 'Plaćanje karticom',
          chooseAnotherWayToPay: '' // sakriveno – samo kartica je način plaćanja
        },
        card: {
          overrides: {
            fields: {
              number: { placeholder: 'Broj kartice' },
              expirationDate: { placeholder: 'MM/GG' },
              cvv: { placeholder: 'CVV' }
            }
          }
        }
      })
      .then((instance) => {
        if (mounted) {
          instanceRef.current = instance;
          dropinInstance = instance;
          instance.on?.('paymentMethodRequestable', () => {
            if (mounted) onPaymentMethodRequestable?.();
          });
          instance.on?.('noPaymentMethodRequestable', () => {
            if (mounted) onNoPaymentMethodRequestable?.();
          });
          onReady?.();
          // Sakrivanje praznog reda "Choose another way to pay"
          setTimeout(() => {
            container.querySelectorAll('a').forEach((a) => {
              if (!(a as HTMLElement).textContent?.trim()) {
                const row =
                  (a as HTMLElement).closest(
                    '[class*="option"], [class*="way"]'
                  ) ?? a.parentElement;
                if (row) (row as HTMLElement).style.display = 'none';
              }
            });
          }, 150);
        } else {
          instance.teardown();
        }
      })
      .catch((err) => {
        if (mounted) onError?.(err);
      });

    return () => {
      mounted = false;
      if (dropinInstance) {
        dropinInstance.teardown();
        dropinInstance = null;
        instanceRef.current = null;
      }
      wrapper.innerHTML = '';
    };
  }, [
    authorization,
    amount,
    currency,
    locale,
    onReady,
    onError,
    onPaymentMethodRequestable,
    onNoPaymentMethodRequestable
  ]);

  return <div ref={containerRef} />;
});
