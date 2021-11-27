import * as React from 'react';
import type { AppProps } from 'next/app';
import '../styles/reboot.min.css';
import '../styles/styles.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
