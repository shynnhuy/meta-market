import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Head from "next/head";
import { useState } from "react";
import { Chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

// import ProgressBar from 'components/ProgressBar';

import { AppProps } from "next/app";
import { INFURA_API_KEY } from "../utils/constants";

export const RPC_BINANCE_TESTNET =
  "https://bsc-testnet.blastapi.io/c1161dbf-28d5-4610-a974-d9b93307f9d7" ||
  `https://data-seed-prebsc-2-s2.binance.org:8545/`;

export const BinanceTestnet: Chain = {
  id: 97,
  name: "Binance",
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
  rpcUrls: {
    default: RPC_BINANCE_TESTNET,
  },
  testnet: true,
  network: "binance",
};

const { chains, provider } = configureChains(
  [BinanceTestnet],
  [infuraProvider({ apiKey: INFURA_API_KEY }), publicProvider()]
);

export const metamaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimChainChangedDisconnect: false,
  },
});

const client = createClient({
  autoConnect: true,
  connectors: [metamaskConnector],
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  // useRouteLoading();

  return (
    <>
      <Head>
        <title>Meta Market</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <WagmiConfig client={client}>
            {/* <ProgressBar /> */}
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </WagmiConfig>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
