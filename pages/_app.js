import "../styles/globals.css";
import Script from "next/script";
import Head from "next/head";
import User from "../context/userContext";
import RegistryContext from "../context/registryContext";
import Nav from "../components/Nav";
import { ethers } from "ethers";
import { InjectedConnector, Provider, chain, defaultChains } from "wagmi";

const provider = new ethers.providers.AlchemyProvider("mainnet");

// Chains for connectors to support
const chains = defaultChains;

// Set up connectors
const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0];
  return [
    new InjectedConnector({
      chains,
      options: {
        shimDisconnect: true,
      },
    }),
  ];
};

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>ENSTogether</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script id="google-analytics" strategy="lazyOnload">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
                `}
      </Script>
      <Provider autoConnect connectors={connectors} provider={provider}>
        <User autoConnect connectors={connectors} provider={provider}>
          <RegistryContext
            autoConnect
            connectors={connectors}
            provider={provider}
          >
            <Nav />
            <Component {...pageProps} />
          </RegistryContext>
        </User>
      </Provider>
    </>
  );
}

export default MyApp;
