'use client';

import {
  Link as IntlLink,
  usePathname,
  useRouter
} from '@green-world/i18n/navigation';
import {
  useParams as useNextParams,
  useSearchParams as useNextSearchParams
} from 'next/navigation';
import React from 'react';

type NavigateFunction = (
  to: string | number,
  options?: { replace?: boolean; state?: unknown }
) => void;

export const useNavigate = (): NavigateFunction => {
  const router = useRouter();

  return (to, options) => {
    if (typeof to === 'number') {
      if (typeof window !== 'undefined') {
        window.history.go(to);
      }
      return;
    }

    if (typeof window !== 'undefined' && options?.state !== undefined) {
      const fn = options.replace ? 'replaceState' : 'pushState';
      window.history[fn](options.state, '', window.location.href);
    }

    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
};

export const useLocation = () => {
  const pathname = usePathname();
  const [search, setSearch] = React.useState('');
  const [hash, setHash] = React.useState('');
  const [state, setState] = React.useState<unknown>(null);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncLocation = () => {
      setSearch(window.location.search);
      setHash(window.location.hash);
      setState(window.history.state ?? null);
    };

    syncLocation();
    window.addEventListener('popstate', syncLocation);
    return () => window.removeEventListener('popstate', syncLocation);
  }, [pathname]);

  return {
    pathname,
    search,
    hash,
    state
  };
};

export const useParams = <T extends Record<string, string>>() => {
  return useNextParams<T>();
};

export const useSearchParams = () => {
  const nextParams = useNextSearchParams();
  const [params, setParams] = React.useState(
    new URLSearchParams(nextParams.toString())
  );

  React.useEffect(() => {
    setParams(new URLSearchParams(nextParams.toString()));
  }, [nextParams]);

  const setSearchParams = (
    next:
      | URLSearchParams
      | string
      | ((prev: URLSearchParams) => URLSearchParams),
    options?: { replace?: boolean }
  ) => {
    if (typeof window === 'undefined') return;

    const nextValue =
      typeof next === 'function' ? next(new URLSearchParams(params)) : next;
    const value =
      typeof nextValue === 'string'
        ? nextValue
        : new URLSearchParams(nextValue).toString();

    const method = options?.replace ? 'replaceState' : 'pushState';
    window.history[method](
      window.history.state,
      '',
      `${window.location.pathname}?${value}`
    );
    setParams(new URLSearchParams(value));
  };

  return [params, setSearchParams] as const;
};

type LinkProps = Omit<React.ComponentProps<typeof IntlLink>, 'href'> & {
  to?: string;
  href?: string;
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, href, ...props }, ref) => (
    <IntlLink
      ref={ref as any}
      href={(href ?? to ?? '/') as any}
      {...(props as any)}
    />
  )
);

Link.displayName = 'RouterCompatLink';

export const Navigate = ({
  to,
  replace
}: {
  to: string;
  replace?: boolean;
}) => {
  const router = useRouter();

  React.useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [replace, router, to]);

  return null;
};

export const Outlet = ({ children }: { children?: React.ReactNode }) => (
  <>{children}</>
);

export const RouterProvider = () => null;
export const createBrowserRouter = () => null;
