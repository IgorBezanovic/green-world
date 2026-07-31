'use client';

import { useGoogleLogin } from '@green-world/hooks/useGoogleLogin';
import { type CredentialResponse, useGoogleOAuth } from '@react-oauth/google';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

type GoogleIdentityApi = {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: CredentialResponse) => void;
      }) => void;
      renderButton: (
        container: HTMLElement,
        options: {
          width: number;
          theme: 'outline';
          size: 'large';
          text: 'continue_with';
          logo_alignment: 'center';
        }
      ) => void;
    };
  };
};

export const GoogleLoginAuth = () => {
  const { t } = useTranslation();
  const googleLoginMutation = useGoogleLogin();
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();

  const wrapRef = useRef<HTMLDivElement>(null);
  const mutationRef = useRef(googleLoginMutation);
  const translationRef = useRef(t);
  mutationRef.current = googleLoginMutation;
  translationRef.current = t;

  useEffect(() => {
    const gsiWindow = window as typeof window & {
      google?: GoogleIdentityApi;
      __greenWorldGsiClientId?: string;
      __greenWorldGsiCredentialHandler?: (response: CredentialResponse) => void;
    };
    const googleIdentity = gsiWindow.google?.accounts?.id;
    if (!scriptLoadedSuccessfully || !googleIdentity) return;

    gsiWindow.__greenWorldGsiCredentialHandler = (credentialResponse) => {
      const googleCredential = credentialResponse?.credential;
      if (!googleCredential) {
        toast.error(translationRef.current('googleLoginAuth.tokenNotProvided'));
        return;
      }

      mutationRef.current.mutate(googleCredential);
    };

    if (gsiWindow.__greenWorldGsiClientId !== clientId) {
      googleIdentity.initialize({
        client_id: clientId,
        callback: (response) =>
          gsiWindow.__greenWorldGsiCredentialHandler?.(response)
      });
      gsiWindow.__greenWorldGsiClientId = clientId;
    }

    const renderGoogleButton = () => {
      const container = wrapRef.current;
      if (!container) return;

      const width = Math.max(200, Math.min(400, container.clientWidth));
      container.replaceChildren();
      googleIdentity.renderButton(container, {
        width,
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        logo_alignment: 'center'
      });
    };

    renderGoogleButton();

    const ro = new ResizeObserver(renderGoogleButton);
    if (wrapRef.current) ro.observe(wrapRef.current);

    return () => ro.disconnect();
  }, [clientId, scriptLoadedSuccessfully]);

  return (
    <div
      ref={wrapRef}
      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
    />
  );
};
