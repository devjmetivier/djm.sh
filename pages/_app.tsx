import { ZEITUIProvider, CSSBaseline } from "@zeit-ui/react";

export default ({ Component, pageProps }: any) => (
  <ZEITUIProvider>
    <CSSBaseline />
    <Component {...pageProps} />
  </ZEITUIProvider>
);
