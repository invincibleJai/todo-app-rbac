import React from 'react';

import {
  configApiRef,
  useApi,
  type SignInPageProps,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';

import {
  SignInPage as CCSignInPage,
  ProxiedSignInPage,
  type SignInProviderConfig,
} from '@backstage/core-components';

const DEFAULT_PROVIDER = 'github';

const PROVIDERS = new Map<string, SignInProviderConfig | string>([
    [
      'github',
      {
        id: 'github-auth-provider',
        title: 'GitHub',
        message: 'Sign in using GitHub',
        apiRef: githubAuthApiRef,
      },
    ],
  ]);

  
export function SignInPage(props: SignInPageProps): React.JSX.Element {
    const configApi = useApi(configApiRef);
    const isDevEnv = configApi.getString('auth.environment') === 'development';
    const provider =
      configApi.getOptionalString('signInPage') ?? DEFAULT_PROVIDER;
    const providerConfig =
      PROVIDERS.get(provider) ?? PROVIDERS.get(DEFAULT_PROVIDER)!;
  
    if (typeof providerConfig === 'object') {
      const providers = isDevEnv
        ? (['guest', providerConfig] satisfies ['guest', SignInProviderConfig])
        : [providerConfig];
  
      return (
        <CCSignInPage
          {...props}
          title="Select a sign-in method"
          align="center"
          providers={providers}
        />
      );
    }
  
    return <ProxiedSignInPage {...props} provider={providerConfig} />;
  }