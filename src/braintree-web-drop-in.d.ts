declare module 'braintree-web-drop-in' {
  interface DropinCreateOptions {
    authorization: string;
    container: string | HTMLElement;
    locale?: string;
    paymentOptionPriority?: string[];
    paypal?: unknown;
    paypalCredit?: unknown;
    currency?: string;
    threeDSecure?: boolean;
    card?: { overrides?: object };
    translations?: Record<string, string>;
  }

  interface DropinInstance {
    requestPaymentMethod(
      cb?: (
        err: Error | null,
        payload?: { nonce?: string; paymentMethodNonce?: string }
      ) => void
    ): Promise<{ nonce: string }>;
    teardown(): Promise<void>;
    on(event: string, callback: (e?: object) => void): void;
  }

  function create(options: DropinCreateOptions): Promise<DropinInstance>;

  const dropin: { create: typeof create };
  export default dropin;
}
