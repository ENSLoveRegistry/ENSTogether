import { createContext, useState, useEffect } from "react";
import { useContractRead } from "wagmi";
import useSWR from "swr";
import { ethers } from "ethers";
import { request } from "graphql-request";

const UnitedContext = createContext();

const abi = require("../config/ENSTogetherABI");
const contractAddress = require("../config/contractAddress");

export default function RegistryContext({ children }) {
  const [cost, setCost] = useState(null);
  const [proposalsCounter, setProposalsCounter] = useState(null);
  const [registryCounter, setRegistryCounter] = useState(null);

  const APIURL =
    "https://api.thegraph.com/subgraphs/id/Qma7UcniLRUt6ZUpuLUE1mpY41BofNE8qktBPLUNKmVzx5";

  //Stats from registry

  const [{ data: props }] = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: abi,
    },
    "proposalsCounter",
    {
      watch: true,
    }
  );
  const [{ data: regCount }] = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: abi,
    },
    "registryCounter",
    {
      watch: true,
    }
  );
  const [{ data: c }] = useContractRead(
    {
      addressOrName: contractAddress,
      contractInterface: abi,
    },
    "cost"
  );

  //Fetching stats from registry
  const statsFromRegistry = async () => {
    try {
      {
        c != undefined
          ? setCost(`${ethers.utils.formatUnits(c.toString())} ETH`)
          : "";
      }
      {
        props != undefined ? setProposalsCounter(props.toString()) : "";
      }
      {
        regCount != undefined ? setRegistryCounter(regCount.toString()) : "";
      }
    } catch (err) {
      console.log("Error: ", err);
    }
  };

  //fetching unions

  const fetcher = (query) => request(APIURL, query);
  const { data: unions, error } = useSWR(
    `{
    unions(first: 100) {
      id
      from
      to
      createdAt
      registryNumber
    }
  }`,
    fetcher,
    { refreshInterval: 4000 }
  );
  useEffect(() => {
    statsFromRegistry();
  }, [props, regCount]);

  return (
    <UnitedContext.Provider
      value={{
        proposalsCounter,
        cost,
        registryCounter,
        statsFromRegistry,
        unions,
      }}
    >
      {children}
    </UnitedContext.Provider>
  );
}

const UnitedContextConsumer = UnitedContext.Consumer;

export { UnitedContextConsumer, UnitedContext };
