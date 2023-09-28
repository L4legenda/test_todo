import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from '../components/provider';
import { ProviderPeer } from '../components/ProviderPeer';

export default function App({ Component, pageProps }: AppProps) {
  return <Provider>
    {/* <ProviderPeer> */}
    <Component {...pageProps} />
    {/* </ProviderPeer> */}
  </Provider>
}
