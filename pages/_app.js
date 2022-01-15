import "../styles/globals.css";
import User from "../context/userContext";
import RegistryContext from "../context/registryContext";
import Nav from "../components/Nav";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import {
  InjectedConnector,
  Provider,
  WalletConnectConnector,
  WalletLinkConnector,
  chain,
  defaultChains,
} from "wagmi";

const provider = new ethers.providers.AlchemyProvider("goerli");

// Chains for connectors to support
const chains = defaultChains;

// Set up connectors
const connectors = ({ chainId }) => {
  const rpcUrl =
    chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0];
  return [new InjectedConnector({ chains })];
};

function MyApp({ Component, pageProps }) {
  return (
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
  );
}

export default MyApp;
