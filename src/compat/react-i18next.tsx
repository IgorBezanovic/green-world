'use client';

import i18n, {
  SUPPORTED_LANGUAGES,
  SupportedLanguage
} from '@green-world/i18n';
import { usePathname, useRouter } from '@green-world/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';

type TFunction = (key: string, values?: unknown) => string;

const normalizeLanguage = (language?: string | null): SupportedLanguage => {
  const normalized = language?.toLowerCase().split('-')[0] as SupportedLanguage;
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : 'sr';
};

export const useTranslation = () => {
  const tIntl = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const t: TFunction = React.useCallback(
    (key: string, values?: unknown) => {
      try {
        if (values && typeof values === 'object') {
          return tIntl(key as never, values as never);
        }

        return tIntl(key as never);
      } catch {
        if (typeof values === 'string') {
          return values;
        }

        return i18n.t(
          key,
          (values ?? undefined) as Record<string, unknown> | undefined
        );
      }
    },
    [tIntl]
  );

  const api = React.useMemo(
    () => ({
      language: normalizeLanguage(locale),
      exists: (key: string, options?: { lng?: string }) =>
        i18n.exists(key, { lng: options?.lng ?? locale }),
      t,
      changeLanguage: (language: SupportedLanguage) => {
        const nextLocale = normalizeLanguage(language);
        i18n.changeLanguage(nextLocale);
        router.replace(pathname, { locale: nextLocale });
      }
    }),
    [locale, pathname, router, t]
  );

  return { t, i18n: api };
};

export const Trans = ({
  i18nKey,
  values,
  components,
  children
}: {
  i18nKey: string;
  values?: Record<string, unknown>;
  components?: Record<string, React.ReactElement>;
  t?: unknown;
  children?: React.ReactNode;
}) => {
  const tIntl = useTranslations();

  const richValues = React.useMemo(() => {
    const componentMap: Record<
      string,
      (chunks: React.ReactNode) => React.ReactNode
    > = {};

    Object.entries(components ?? {}).forEach(([key, element]) => {
      const reactElement = element as React.ReactElement<
        Record<string, unknown>
      >;
      componentMap[key] = (chunks: React.ReactNode) =>
        React.cloneElement(reactElement, reactElement.props, chunks);
    });

    return {
      ...(values ?? {}),
      ...componentMap
    };
  }, [components, values]);

  try {
    return <>{tIntl.rich(i18nKey as never, richValues as never)}</>;
  } catch {
    return <>{children ?? i18n.t(i18nKey, values)}</>;
  }
};
